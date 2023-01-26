<script lang="ts" setup>
import { useWebSocket, useTitle, useFavicon } from "@vueuse/core"
import { computed, ref, reactive, watch } from "vue"
import { onBeforeRouteLeave, useRoute } from "vue-router"

// Components
import Card from "../components/Card.vue"

// Types
import type { LanyardData } from "../types/lanyard"

const route = useRoute()
const socketLoaded = ref(false)
const imageError = ref(false)

const user = reactive({ error: false, data: {} }) as {
  error: boolean
  data: LanyardData
}

// Computed methods

/**
 * Returns if we still haven't connected to Lanyard API.
 */
const isConnecting = computed(
  () => socketLoaded.value === false && Object.keys(user.data)?.length === 0
)

/**
 * Returns user information including formatted avatar URL.
 */
const getUser = computed(() => {
  const { username, id, discriminator, avatar } = user.data?.discord_user || {}
  const fallbackImage = "https://i.imgur.com/sn7gwcA.png"

  const avatarUri = `https://cdn.discordapp.com/avatars/${id}/${avatar}.${
    avatar?.startsWith("a_") ? "gif" : "png"
  }?size=512`

  return {
    id,
    username: username || "Loading",
    discriminator: discriminator || "0000",
    avatar: avatar && imageError.value === false ? avatarUri : fallbackImage,
  }
})

/**
 * Returns all essential playing status data in the Spotify object.
 */
const getPlayingStatus = computed(() => {
  const isSpotify = user.data?.spotify !== null

  if (isSpotify) {
    const {
      song,
      artist,
      album,
      timestamps,
      album_art_url: image,
      track_id: trackId,
    } = user.data?.spotify || {}

    return {
      timestamps,
      name: song,
      details: artist,
      state: album,
      largeImage: image,
      spotify: true,
      trackId,
    }
  } else {
    const { details, state, name, application_id, assets, timestamps } =
      user.data?.activities?.filter((activity) => activity.type === 0)?.pop() ||
      {}

    let largeImage, smallImage

    if (application_id) {
      if (assets?.large_image)
        largeImage = `https://cdn.discordapp.com/app-assets/${application_id}/${assets.large_image}.png`

      if (assets?.small_image)
        smallImage = `https://cdn.discordapp.com/app-assets/${application_id}/${assets.small_image}.png`
    }

    return {
      details,
      state,
      name,
      largeImage,
      smallImage,
      timestamps,
    }
  }
})

// Watchers
watch(
  () => getUser?.value,
  (newValue, oldValue) => {
    if (newValue?.username !== oldValue?.username)
      useTitle(`${newValue.username}'s Status - Lanyard Visualizer`)
    if (newValue?.avatar !== oldValue?.avatar)
      useFavicon(newValue.avatar || "/favicon.ico")
  }
)

// Connect to Lanyard socket when the app is mounted
const userId = route.params.id

if (userId === null || userId?.length < 17) user.error = true
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
      send(
        JSON.stringify({
          op: 2,
          d: {
            subscribe_to_id: userId,
          },
        })
      )

      socketLoaded.value = true
    },

    // Set the reactive object to data from Lanyard
    onMessage(_, { data }) {
      const { t: type, d: status } = JSON.parse(data)
      if (["INIT_STATE", "PRESENCE_UPDATE"].includes(type)) user.data = status
    },
  })

  // Close the WS connection on route change
  onBeforeRouteLeave(() => {
    close()
  })
}
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div
      v-if="user.error === true"
      class="mx-auto space-y-4 h-screen flex flex-col justify-center text-center md:w-2/4"
    >
      <h1 class="font-bold text-white text-shadow-md text-3xl">
        Couldn't Establish a WS Connection
      </h1>

      <p class="text-white/50 w-3/4 mx-auto">
        Make sure you entered a valid Discord user ID and make sure the user is
        in
        <a
          href="https://lanyard.rest/discord"
          title="Join Discord"
          class="underline underline-dashed underline-white/20"
          rel="noreferrer"
          target="_blank"
          >Lanyard's Discord server</a
        >. Reload the page after you join the Discord server or try with an user
        ID who is already in Discord.
      </p>

      <RouterLink
        :to="{
          query: route.query,
          name: 'Home',
        }"
        class="btn w-max mx-auto"
      >
        Go back home
      </RouterLink>
    </div>

    <div
      v-else
      class="flex flex-col justify-center w-full mx-auto h-screen space-y-4 md:w-4/12 2xl:w-3/12"
    >
      <!-- Title -->
      <div class="flex items-center justify-between">
        <div class="flex space-x-2 items-center">
          <div class="flex-shrink-0">
            <img
              :src="getUser.avatar || ''"
              class="rounded-full h-14 shadow-lg w-14"
              width="24"
              height="24"
              draggable="false"
              alt="user avatar"
              @load="imageError = false"
              @error="imageError = true"
            />
          </div>

          <div>
            <h1 class="font-semibold text-xl leading-tight">
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

      <!-- Card -->
      <Card
        v-if="
          Object.values(getPlayingStatus || {}).filter((item) => item)?.length >
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

      <div v-else class="rounded-lg bg-white/5 text-white/30 text-sm p-4">
        {{
          isConnecting
            ? "Trying to establish a WS connection..."
            : "User is not playing anything."
        }}
      </div>

      <RouterLink
        :to="{
          query: route.query,
          name: 'Home',
        }"
        class="btn w-max mx-auto"
      >
        Go back home
      </RouterLink>
    </div>
  </Transition>
</template>
