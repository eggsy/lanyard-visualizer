<script lang="ts" setup>
import { computed, ref } from "vue"
import { useRoute } from "vue-router"

// Import compnoents
import Options from "./components/Options.vue"

// Import backgrounds
import backgrounds from "./data/backgrounds"

// Component options
const route = useRoute()
const getOptions = computed(() => {
  const { name, query } = route

  return {
    name,
    query,
    mode: query.mode,
    background: query.background !== "false",
  }
})

const background = ref(
  backgrounds[Math.floor(Math.random() * backgrounds.length)]
)

const toggleTheme = (theme: string) => {
  background.value = theme
}
</script>

<template>
  <Options :currentBg="background" @updateTheme="toggleTheme" />

  <div
    class="bg-gradient-to-tl flex min-h-screen text-white items-center justify-center"
    :class="{
      'bg-black': getOptions.background === false,
      [background]: getOptions.background === true,

      'px-4': getOptions.mode !== 'iframe',
    }"
  >
    <div
      :class="
        getOptions.mode !== 'iframe' ? 'container mx-auto' : 'w-screen h-screen'
      "
    >
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
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
