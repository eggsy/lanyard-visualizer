<template>
  <div
    ref="target"
    class="space-y-4 flex flex-col p-4 bg-gray-100 bg-opacity-20 shadow-lg rounded-lg"
    :style="continerStyles"
  >
    <div class="flex items-center space-x-4">
      <div class="flex-shrink-0 relative">
        <img
          :src="getImageUrl?.largeImage"
          width="128"
          height="128"
          draggable="false"
          alt="large image"
          class="rounded-xl h-28 w-28"
          @error="imageError.large = true"
        />

        <img
          v-if="getImageUrl?.smallImage"
          :src="getImageUrl?.smallImage"
          width="16"
          height="16"
          draggable="false"
          alt="small image"
          class="rounded-full absolute bg-gray-100 bg-opacity-20 h-6 w-6 bottom-0 right-0 ring-4 ring-gray-100 ring-opacity-20"
          @error="imageError.small = true"
        />
      </div>

      <div class="overflow-x-hidden space-y-px">
        <a
          v-if="isSpotify && trackId"
          :href="`https://open.spotify.com/track/${trackId}`"
          target="_blank"
          rel="noreferrer"
          title="Open on Spotify"
          class="font-semibold leading-tight text-lg truncate hover:underline cursor-pointer"
          >{{ name }}</a
        >

        <h1 v-else class="font-semibold leading-tight text-lg truncate">
          {{ name }}
        </h1>

        <h2 v-if="details" class="opacity-90 leading-tight line-clamp-2">
          {{ isSpotify ? "by" : "" }} {{ details }}
        </h2>

        <h2 v-if="state" class="opacity-90 leading-tight line-clamp-2">
          {{ isSpotify ? "on" : "" }} {{ state }}
        </h2>

        <span
          v-if="!isSpotify && getTime"
          class="opacity-90 leading-tight truncate"
          >{{ getTime }}</span
        >
      </div>
    </div>

    <div v-if="isSpotify && timestamps">
      <Progress :start="timestamps?.start" :end="timestamps?.end" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useParallax, useMouseInElement } from '@vueuse/core'
import { defineProps, ref, reactive, computed, watch, onMounted } from "vue";

// Components
import Progress from "./Progress.vue"

// Types
import type { PropType, CSSProperties, ComputedRef } from "vue"
import type { Timestamps } from "../types/lanyard";

// References
const time = ref(new Date().getTime())
const imageError = reactive({ large: false, small: false })
const target = ref(null)

const parallax = reactive(useParallax(target))
const { isOutside } = useMouseInElement(target)

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
    default: ""
  },
  timestamps: {
    type: Object as PropType<Timestamps>,
    required: false,
    default: () => { }
  },
  isSpotify: {
    type: Boolean,
    required: false,
    default: false
  },
  trackId: {
    type: String,
    required: false,
    default: ""
  }
});

// Watchers
watch(() => [props.largeImage, props.smallImage], () => {
  if (imageError.large === true) imageError.large = false
  if (imageError.small === true) imageError.small = false
})

onMounted(() => {
  setInterval(() => {
    time.value = new Date().getTime()
  }, 100)
})

// Computed methods
const getImageUrl = computed(() => {
  const object = {
    largeImage: "https://i.imgur.com/j1HAfFJ.png",
    smallImage: null
  } as {
    largeImage: string,
    smallImage: string | null
  }

  if (imageError.large === false) object.largeImage = props.largeImage
  if (imageError.small === false) object.smallImage = props.smallImage

  return object
})

const getTime = computed(() => {
  if (props.isSpotify) return;

  const { start, end } = props.timestamps || {}

  const mapFunction = (time: number) => `0${time}`.slice(-2);

  if (!start && !end) return;
  else if (start && !end) {
    const timeElapsed = time.value - start;

    const timeElapsedArray = [
      Math.round((timeElapsed / (1000 * 60 * 60))),
      Math.round((timeElapsed / (1000 * 60)) % 59),
      Math.round((timeElapsed / 1000) % 59),
    ];

    // Remove hours if it's not been an hour
    if (String(timeElapsedArray[0]) === "0") timeElapsedArray.shift()

    return `${timeElapsedArray.map(mapFunction).join(":")} elapsed`
  } else if (start && end) {
    const timeLeft = end - time.value;

    const timeLeftArray = [
      Math.round((timeLeft / (1000 * 60 * 60))),
      Math.round((timeLeft / (1000 * 60)) % 59),
      Math.round((timeLeft / 1000) % 59),
    ];

    // Remove hours if it's not been an hour
    if (String(timeLeftArray[0]) === "0") timeLeftArray.shift()

    return `${timeLeftArray.map(mapFunction).join(":")} left`
  }
})

const continerStyles: ComputedRef<CSSProperties> = computed(() => {
  return {
    transition: "transform .2s",
    transform:
      isOutside?.value === true ?
        'rotateX(0) rotateY(0' : `rotateX(${parallax.roll * 20}deg) rotateY(${parallax.tilt * 20}deg)`,
  }
})
</script>