<script lang="ts" setup>
import { useTimestamp } from "@vueuse/core"
import { ref, reactive, computed, watch } from "vue"
import { useRoute } from "vue-router"

// Components
import Progress from "./Progress.vue"

// Types
import type { PropType } from "vue"
import type { Timestamps } from "../types/lanyard"

// References
const target = ref(null)

// Options
const { query } = useRoute()

// Reactive objects
const imageError = reactive({ large: false, small: false })
const timestamp = useTimestamp()

// Props
const props = defineProps({
  name: {
    type: String,
    required: false,
    default: "",
  },
  details: {
    type: String,
    required: false,
    default: "",
  },
  state: {
    type: String,
    required: false,
    default: "",
  },
  largeImage: {
    type: String,
    required: false,
    default: "https://i.imgur.com/j1HAfFJ.png",
  },
  smallImage: {
    type: String,
    required: false,
    default: "",
  },
  timestamps: {
    type: Object as PropType<Timestamps>,
    required: false,
    default: () => ({}),
  },
  isSpotify: {
    type: Boolean,
    required: false,
    default: false,
  },
  trackId: {
    type: String,
    required: false,
    default: "",
  },
})

// Watchers
watch(
  () => [props.largeImage, props.smallImage],
  () => {
    if (imageError.large === true) imageError.large = false
    if (imageError.small === true) imageError.small = false
  }
)

// Computed methods
const getImageUrl = computed(() => {
  const object = {
    largeImage: "https://i.imgur.com/j1HAfFJ.png",
    smallImage: null,
  } as {
    largeImage: string
    smallImage: string | null
  }

  if (imageError.large === false) object.largeImage = props.largeImage
  if (imageError.small === false) object.smallImage = props.smallImage

  return object
})

const getTime = computed(() => {
  if (props.isSpotify) return

  const { start, end } = props.timestamps || {}
  const currentTime = timestamp.value

  const mapFunction = (time: number) => `0${time}`.slice(-2)

  if (!start && !end) return
  else if (start && !end) {
    const timeElapsed = Math.abs(currentTime - start) / 1000

    const timeElapsedArray = [
      Math.floor(timeElapsed / 3600) % 24,
      Math.floor(timeElapsed / 60) % 60,
      Math.floor(timeElapsed % 60),
    ]

    // Remove hours if it's not been an hour
    if (String(timeElapsedArray[0]) === "0") timeElapsedArray.shift()

    return `${timeElapsedArray.map(mapFunction).join(":")} elapsed`
  } else if (end) {
    const timeLeft = Math.abs(end - timestamp.value) / 1000

    const timeLeftArray = [
      Math.floor(timeLeft / 3600) % 24,
      Math.floor(timeLeft / 60) % 60,
      Math.floor(timeLeft % 60),
    ]

    // Remove hours if it's not been an hour
    if (String(timeLeftArray[0]) === "0") timeLeftArray.shift()

    return `${timeLeftArray.map(mapFunction).join(":")} left`
  }
})
</script>

<template>
  <div
    ref="target"
    class="rounded-lg flex flex-col space-y-4 bg-white/10 p-4 overflow-x-hidden"
  >
    <div class="flex space-x-4 items-center">
      <div class="flex-shrink-0 relative">
        <img
          :src="getImageUrl?.largeImage"
          width="128"
          height="128"
          draggable="false"
          alt="Large image"
          class="rounded-xl h-28 w-28"
          @error="imageError.large = true"
        />

        <img
          v-if="getImageUrl?.smallImage"
          :src="getImageUrl.smallImage"
          width="16"
          height="16"
          draggable="false"
          alt="Small image"
          class="rounded-full bg-gray-100 bg-opacity-20 h-6 right-0 bottom-0 ring-4 ring-gray-100 ring-opacity-20 w-6 absolute"
          @error="imageError.small = true"
        />
      </div>

      <div class="space-y-px">
        <a
          v-if="isSpotify && trackId"
          :href="`https://open.spotify.com/track/${trackId}`"
          target="_blank"
          rel="noreferrer"
          title="Open on Spotify"
          class="cursor-pointer font-semibold text-lg leading-tight truncate hover:underline"
          >{{ name }}</a
        >

        <h1 v-else class="font-semibold text-lg leading-tight truncate">
          {{ name }}
        </h1>

        <h2 v-if="details" class="leading-tight opacity-90 line-clamp-2">
          {{ isSpotify ? "by" : "" }} {{ details }}
        </h2>

        <h2 v-if="state" class="leading-tight opacity-90 line-clamp-2">
          {{ isSpotify ? "on" : "" }} {{ state }}
        </h2>

        <span
          v-if="!isSpotify && getTime"
          class="leading-tight opacity-90 truncate"
          >{{ getTime }}</span
        >
      </div>
    </div>

    <div v-if="isSpotify && timestamps && query.progress !== 'false'">
      <Progress :start="timestamps?.start" :end="timestamps?.end" />
    </div>
  </div>
</template>
