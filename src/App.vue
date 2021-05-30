<template>
  <div
    class="bg-gradient-to-tl min-h-screen text-white px-4 md:px-0"
    :class="{
      [background]: true,
      'flex items-center justify-center':
        getOptions.name !== 'User' || getOptions.mode !== 'iframe'
    }"
  >
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

  <footer
    v-if="getOptions.mode !== 'iframe'"
    class="text-center bg-gray-900 text-sm text-white space-y-4 py-4"
  >
    <div>
      <p>
        Made by
        <a href="https://eggsy.xyz" rel="noreferrer" class="underline">EGGSY</a>
        with 💖 and the power of
        <a href="https://vuejs.org" rel="noreferrer" class="underline">Vue 3</a
        >!
      </p>

      <p>
        <a
          href="https://github.com/eggsy/lanyard-visualizer"
          rel="noreferrer"
          class="block underline"
          >Source available on GitHub!</a
        >
      </p>
    </div>

    <p v-if="getOptions.name !== 'Home'">
      <router-link to="/" class="btn">Go back home</router-link>
    </p>
  </footer>
</template>

<style>
/* Global transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transition: opacity 0.2s;
}
</style>

<script lang="ts" setup>
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const getOptions = computed(() => {
  const {
    name,
    query: { mode }
  } = route

  return { name, mode }
})

// Available gradient backgrounds
const backgrounds = [
  "from-blue-400 via-blue-500 to-blue-600",
  "from-indigo-400 via-indigo-500 to-indigo-600",
  "from-red-300 via-red-400 to-red-500"
]

// Background reference
const background = backgrounds[Math.floor(Math.random() * backgrounds.length)]
</script>
