<template>
  <div class="bg-gray-200 bg-opacity-25 rounded-lg h-2">
    <div
      class="transition-all opacity-75 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 rounded-lg h-2"
      :style="getStyles"
    ></div>
  </div>

  <div class="flex items-center justify-between">
    <span>{{ getTimeElapsed }}</span>
    <span>{{ getTimeLeft }}</span>
  </div>
</template>

<script lang="ts" setup>
import { useTimestamp } from "@vueuse/core"
import { computed, defineProps } from "vue"

const props = defineProps({
  start: {
    type: Number,
    required: true,
    default: 0
  },
  end: {
    type: Number,
    required: true,
    default: 0
  }
})

// Use a reference to generate reactive time.
const timestamp = useTimestamp()

// Computed methods
const getTimeElapsed = computed(() => {
  const currentTime = timestamp.value
  const timeElapsed = currentTime - props.start

  const timeElapsedArray = [
    Math.round((timeElapsed / (1000 * 60)) % 60),
    Math.round((timeElapsed / 1000) % 60)
  ]

  const mapFunction = (time: number) => `0${time}`.slice(-2)
  return timeElapsedArray.map(mapFunction).join(":")
})

const getTimeLeft = computed(() => {
  const currentTime = timestamp.value
  const timeLeft = props.end - (props.start || currentTime)

  const timeLeftArray = [
    Math.round((timeLeft / (1000 * 60)) % 60),
    Math.round((timeLeft / 1000) % 60)
  ]

  const mapFunction = (time: number) => `0${time}`.slice(-2)
  return timeLeftArray.map(mapFunction).join(":")
})

const getStyles = computed(() => {
  const total = props.end - props.start
  const progress = 100 - (100 * (props.end - timestamp.value)) / total

  if (progress > 100)
    return {
      width: "100%"
    }
  else
    return {
      width: `${progress.toFixed(2)}%`
    }
})
</script>
