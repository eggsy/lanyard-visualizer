<template>
  <div class="bg-gray-200 bg-opacity-25 rounded-lg h-2">
    <div
      class="transition-all opacity-75 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 rounded-lg h-2"
      :style="getStyles"
    ></div>
  </div>

  <div class="flex items-center justify-between">
    <span>{{ getTime.elapsed }}</span>
    <span>{{ getTime.left }}</span>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  onBeforeUnmount,
  onMounted,
  reactive
} from "vue"

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
const time = reactive<{
  instance: NodeJS.Timeout | null
  stamp: number
}>({
  instance: null,
  stamp: new Date().getTime()
})

// Updated reactive time every 100 milliseconds.
onMounted(() => {
  setInterval(() => {
    time.stamp = new Date().getTime()
  }, 100)
})

onBeforeUnmount(() => {
  if (time.instance) clearInterval(time.instance)
})

/**
 * Returns elapsed and left time information.
 */
const getTime = computed(() => {
  if (props.start === 0 && props.end === 0)
    return { elapsed: "00:00", left: "00:00" }

  const timeElapsed = time.stamp - props.start
  const timeLeft = props.end - time.stamp

  const timeElapsedArray = [
    Math.round((timeElapsed / (1000 * 60)) % 60),
    Math.round((timeElapsed / 1000) % 60)
  ]

  const timeLeftArray = [
    Math.round((timeLeft / (1000 * 60)) % 60),
    Math.round((timeLeft / 1000) % 60)
  ]

  const mapFunction = (time: number) => `0${time}`.slice(-2)

  return {
    elapsed: timeElapsedArray.map(mapFunction).join(":"),
    left: timeLeftArray.map(mapFunction).join(":")
  }
})

/**
 * Returns the width percentage of progress bar.
 */
const getStyles = computed(() => {
  const total = props.end - props.start
  const progress = 100 - (100 * (props.end - time.stamp)) / total

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
