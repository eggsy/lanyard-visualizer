<template>
  <div
    class="bg-gradient-to-tl flex items-center justify-center min-h-screen text-white px-4 md:px-0"
    :class="background"
  >
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

  <div
    class="absolute bottom-4 left-0 right-0 text-center text-sm text-white opacity-90"
  >
    Made by
    <a href="https://eggsy.xyz" rel="noreferrer" class="underline">EGGSY</a>
    with 💖 and the power of
    <a href="https://vuejs.org" rel="noreferrer" class="underline">Vue 3</a>!
    <a
      href="https://github.com/eggsy/lanyard-visualizer"
      rel="noreferrer"
      class="block underline"
      >Source available on GitHub!</a
    >
  </div>
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
// Available gradient backgrounds
const backgrounds = [
  "from-blue-400 via-blue-500 to-blue-600",
  "from-indigo-400 via-indigo-500 to-indigo-600",
  "from-red-300 via-red-400 to-red-500"
]

// Background reference
const background = backgrounds[Math.floor(Math.random() * backgrounds.length)]
</script>
