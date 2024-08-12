<template>
  <div class="min-h-screen text-white">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
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
