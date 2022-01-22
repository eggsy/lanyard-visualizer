<script lang="ts" setup>
import { ref, computed } from "vue"
import { useRoute } from "vue-router"

// Import backgrounds
import backgrounds from "../data/backgrounds"

defineProps({
  currentBg: {
    type: String,
  },
})

const emit = defineEmits(["updateTheme"])
const showCollapsed = ref(false)

const getRoute = computed(() => {
  const { path, query } = useRoute()
  return { path, query }
})

const toggleClass = (theme: string) => {
  emit("updateTheme", theme)
}
</script>

<template>
  <div
    v-if="getRoute.query['background'] !== 'false'"
    class="flex flex-row flex-row-reverse top-4 right-4 left-4 absolute justify-between md:(flex-col justify-end space-y-4) "
  >
    <!-- Background options -->
    <div class="flex space-x-4 items-center">
      <button class="control-button" @click="showCollapsed = !showCollapsed">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      <div v-show="showCollapsed === true" class="flex space-x-2 items-center">
        <div
          v-for="background in backgrounds"
          class="bg-gradient-to-tl rounded-full cursor-pointer h-6 transition-all w-6"
          :class="[
            background,
            background === currentBg
              ? 'ring-2 ring-white/50 opacity-100'
              : 'opacity-50 hover:opacity-100',
          ]"
          @click="toggleClass(background)"
        />
      </div>
    </div>

    <!-- Go back -->
    <div v-if="getRoute.path !== '/'">
      <button
        class="control-button"
        @click="$router.push({ path: '/', query: getRoute.query })"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.control-button {
  @apply rounded-full transition-all text-white/75 hover:(ring-4 text-white ring-gray-800/50 bg-gray-800/50) focus:outline-none ;
}
</style>
