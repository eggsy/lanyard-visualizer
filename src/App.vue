<template>
  <div
    class="
      bg-gradient-to-tl
      flex
      items-center
      justify-center
      min-h-screen
      from-blue-500
      text-white
      via-purple-500
      to-red-500
    "
  >
    <div class="md:w-5/12 2xl:w-3/12 flex flex-col space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="flex-shrink-0">
            <img
              :src="getUser.avatar"
              class="h-14 w-14 rounded-full shadow-lg"
              width="24"
              height="24"
              draggable="false"
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
          class="
            bg-gray-100 bg-opacity-10
            hover:bg-opacity-25
            transition
            px-4
            py-2
            rounded-lg
            text-white
          "
        >
          View User
        </a>
      </div>

      <div
        :class="isConnecting && 'animate-pulse'"
        class="p-4 bg-gray-100 bg-opacity-20 shadow-lg rounded-lg"
      >
        <div v-if="!getPlayingStatus.error" class="space-y-4">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <img
                :src="getPlayingStatus?.image"
                width="128"
                height="128"
                class="rounded-xl shadow-lg h-28 w-28"
                draggable="false"
              />
            </div>

            <div class="overflow-x-hidden">
              <h1 class="font-semibold leading-tight text-lg truncate">
                {{ getPlayingStatus?.song || "Not Playing Anything" }}
              </h1>

              <h2
                v-if="getPlayingStatus?.artist"
                class="text-gray-100 leading-tight line-clamp-2"
              >
                by {{ getPlayingStatus?.artist }}
              </h2>

              <h2
                v-if="getPlayingStatus?.album"
                class="text-gray-100 leading-tight line-clamp-2"
              >
                on {{ getPlayingStatus?.album }}
              </h2>
            </div>
          </div>

          <div>
            <Progress
              :start="getPlayingStatus?.timestamps?.start"
              :end="getPlayingStatus?.timestamps?.end"
            />
          </div>
        </div>

        <div v-else>User is not playing anything on Spotify</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed, ref, reactive } from "vue";

import Progress from "./components/Progress.vue";
import type { LanyardData } from "./types/lanyard";

// Fallback user ID that'll be used if there's no one specified as a parameter
const fallbackUserId = "162969778699501569";

// References
const socketLoaded = ref(true);
const user = reactive({ data: {} }) as { data: LanyardData };

// Computed methods

/**
 * Returns if we still haven't connected to Lanyard API.
 */
const isConnecting = computed(
  () => socketLoaded.value === true || Object.keys(user.data)?.length === 0
);

/**
 * Returns user information including formatted avatar URL.
 */
const getUser = computed(() => {
  const { username, id, discriminator, avatar } = user.data?.discord_user || {};

  const avatarUri = avatar
    ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.${
        avatar?.startsWith("a_") ? "gif" : "png"
      }?size=512`
    : "https://canary.discord.com/assets/7c8f476123d28d103efe381543274c25.png";

  return {
    username: username || "Loading",
    id: id || fallbackUserId,
    discriminator: discriminator || "0000",
    avatar: avatarUri,
  };
});

/**
 * Returns all essential playing status data in the Spotify object.
 */
const getPlayingStatus = computed(() => {
  const isSpotify = user.data?.spotify !== null;

  if (isSpotify) {
    const {
      album_art_url: image,
      song,
      artist,
      album,
      timestamps,
    } = user.data?.spotify || {};

    return {
      image: image || "https://via.placeholder.com/125x125C",
      song,
      album,
      artist,
      timestamps: timestamps || { start: 0, end: 0 },
    };
  } else return { error: true };
});

// Connect to Lanyard socket when the app is mounted
onMounted(() => {
  const ws = new WebSocket("wss://api.lanyard.rest/socket");
  const userId =
    new URLSearchParams(location.search).get("userId") || fallbackUserId;

  // Send and let the API know which user we're subscribing
  ws.addEventListener("open", () => {
    ws.send(
      JSON.stringify({
        op: 2,
        d: {
          subscribe_to_id: userId,
        },
      })
    );

    // Send heartbeat every 30 seconds
    setInterval(() => {
      ws.send(
        JSON.stringify({
          op: 3,
        })
      );
    }, 30000);

    socketLoaded.value = false;
  });

  ws.addEventListener("message", ({ data }) => {
    const { t: type, d: status } = JSON.parse(data);
    if (["INIT_STATE", "PRESENCE_UPDATE"].includes(type)) user.data = status;
  });
});
</script>
