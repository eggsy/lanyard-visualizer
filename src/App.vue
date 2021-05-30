<template>
  <div
    class="bg-gradient-to-tl min-h-screen text-white px-4 flex items-center justify-center"
    :class="background"
  >
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

  <footer
    v-if="getOptions.footer !== false && getOptions.mode !== 'iframe'"
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

    <div v-if="getOptions.name !== 'Home'">
      <router-link
        :to="{
          name: 'Home',
          query: getOptions.query
        }"
        class="btn"
      >
        Go back home
      </router-link>
    </div>
  </footer>
</template>

<style>
/*
  * Scrollbar
*/

html {
  scrollbar-width: thin;
  scrollbar-width: 6px;
}

html::-webkit-scrollbar {
  width: 6px;
}

/* Track */
html::-webkit-scrollbar-track {
  background: #f9fafb;
}

/* Handle */
html::-webkit-scrollbar-thumb {
  background: #d1d5db;
}

/*
  * Global Transitions
*/

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
  const { name, query } = route

  return { name, query, mode: query.mode, footer: query.footer !== "false" }
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
