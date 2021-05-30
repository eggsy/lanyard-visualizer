<template>
  <transition name="fade" mode="out-in">
    <div
      v-if="user.error === true"
      class="md:w-2/4 mx-auto space-y-4 text-center md:text-left"
    >
      <h1 class="font-bold text-2xl text-white text-shadow-md">
        Couldn't establish a WS connection to Lanyard API for this user
      </h1>

      <p class="text-gray-100">
        Make sure you entered a valid Discord user ID and make sure the user is
        in
        <a
          href="https://lanyard.rest/discord"
          title="Join Discord"
          class="underline"
          rel="noreferrer"
          target="_blank"
          >Lanyard's Discord server</a
        >. Reload the page after you join the Discord server or try with an user
        ID who is already in Discord.
      </p>

      <div>
        <router-link
          :to="{
            query,
            name: 'Home'
          }"
          class="btn"
          >Go back home</router-link
        >
      </div>
    </div>

    <div
      v-else
      class="w-full mx-auto flex flex-col space-y-4"
      :class="mode !== 'iframe' && 'md:w-5/12 2xl:w-3/12'"
    >
      <div v-if="title === true" class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="flex-shrink-0">
            <img
              :src="getUser.avatar || ''"
              class="h-14 w-14 rounded-full shadow-lg"
              width="24"
              height="24"
              draggable="false"
              @error="imageError = true"
            />
          </div>

          <div>
            <h1 class="text-xl leading-tight font-semibold">
              {{ getUser.username }}
            </h1>

            <h2 class="text-sm leading-tight opacity-50">
              #{{ getUser.discriminator }}
            </h2>
          </div>
        </div>

        <a
          :href="`https://discord.com/users/${getUser.id}`"
          target="_blank"
          rel="noreferrer"
          class="btn"
          >View User</a
        >
      </div>

      <div>
        <Card
          v-if="
            Object.values(getPlayingStatus || {}).filter(item => item)?.length >
              0
          "
          :class="isConnecting && 'animate-pulse'"
          :name="getPlayingStatus.name"
          :largeImage="getPlayingStatus.largeImage || ''"
          :smallImage="getPlayingStatus.smallImage || ''"
          :state="getPlayingStatus.state"
          :details="getPlayingStatus.details"
          :timestamps="getPlayingStatus.timestamps"
          :is-spotify="getPlayingStatus.spotify === true"
          :track-id="getPlayingStatus.trackId"
        />

        <div v-else class="bg-gray-100 bg-opacity-20 rounded-lg p-4">
          {{
            isConnecting
              ? "Trying to establish a WS connection..."
              : "User is not playing anything."
          }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { useWebSocket, useTitle, useFavicon } from "@vueuse/core"
import { computed, ref, reactive, watch } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router"

// Components
import Card from "../../components/Card.vue"

// Types
import type { LanyardData } from "../../types/lanyard";

// References
const socketLoaded = ref(false);
const imageError = ref(false);
const { params, query } = useRoute()

// Reactive objects
const { mode, title } = reactive({ mode: query.mode, title: query.title || true })
const user = reactive({ error: false, data: {} }) as { error: boolean, data: LanyardData };

// Computed methods

/**
 * Returns if we still haven't connected to Lanyard API.
 */
const isConnecting = computed(
  () => socketLoaded.value === false && Object.keys(user.data)?.length === 0
);

/**
 * Returns user information including formatted avatar URL.
 */
const getUser = computed(() => {
  const { username, id, discriminator, avatar } = user.data?.discord_user || {};

  const avatarUri = avatar
    ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.${avatar?.startsWith("a_") ? "gif" : "png"
    }?size=512`
    : "https://canary.discord.com/assets/7c8f476123d28d103efe381543274c25.png";

  return {
    id,
    username: username || "Loading",
    discriminator: discriminator || "0000",
    avatar: !imageError.value && avatarUri,
  };
});

/**
 * Returns all essential playing status data in the Spotify object.
 */
const getPlayingStatus = computed(() => {
  const isSpotify = user.data?.spotify !== null;

  if (isSpotify) {
    const {
      song,
      artist,
      album,
      timestamps,
      album_art_url: image,
      track_id: trackId,
    } = user.data?.spotify || {};

    return {
      timestamps,
      name: song,
      details: artist,
      state: album,
      largeImage: image,
      spotify: true,
      trackId,
    };
  } else {
    const {
      details,
      state,
      name,
      application_id,
      assets,
      timestamps
    } = user.data?.activities?.filter(activity => activity.type === 0)?.pop() || {}

    let largeImage, smallImage;

    if (application_id) {
      if (assets?.large_image) largeImage = `https://cdn.discordapp.com/app-assets/${application_id}/${assets.large_image}.png`

      if (assets?.small_image) smallImage = `https://cdn.discordapp.com/app-assets/${application_id}/${assets.small_image}.png`
    }

    return {
      details,
      state,
      name,
      largeImage,
      smallImage,
      timestamps
    }
  };
});

// Watchers
watch(() => getUser?.value, (newValue, oldValue) => {
  if (newValue?.username !== oldValue?.username) useTitle(`${newValue.username}'s Status - Lanyard Visualizer`)
  if (newValue?.avatar !== oldValue?.avatar) useFavicon(newValue.avatar || "/favicon.ico")
})

// Connect to Lanyard socket when the app is mounted
const userId = params.id;

if (userId === null || userId?.length < 17) user.error = true;
else {
  const { send, close } = useWebSocket("wss://api.lanyard.rest/socket", {
    immediate: true,

    // Attempt to reconnect once (max)
    autoReconnect: {
      retries: 1,
      delay: 1000,
      onFailed() {
        user.error = true
      },
    },

    // Send heartbeat every 30 seconds
    heartbeat: {
      message: JSON.stringify({
        op: 3,
      }),
      interval: 30000,
    },

    // Subscribe to the user WS is connected
    onConnected() {
      send(JSON.stringify({
        op: 2,
        d: {
          subscribe_to_id: userId,
        },
      })
      )

      socketLoaded.value = true
    },

    // Set the reactive object to data from Lanyard
    onMessage(ws, { data }) {
      const { t: type, d: status } = JSON.parse(data);
      if (["INIT_STATE", "PRESENCE_UPDATE"].includes(type)) user.data = status;
    },
  })

  // Close the WS connection on route change
  onBeforeRouteLeave(() => {
    close()
  })
}
</script>
