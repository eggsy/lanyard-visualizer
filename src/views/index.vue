<script lang="ts" setup>
import { onStartTyping, useFavicon, useTitle } from "@vueuse/core"
import { ref } from "vue"
import { useRouter } from "vue-router"

// Icons
import IconGithub from "~icons/tabler/brand-github"
import IconLink from "~icons/tabler/link"

const router = useRouter()

const userId = ref("")
const inputFocused = ref(false)
const inputElement = ref<HTMLInputElement | null>(null)

const handleSubmit = async () => {
  if (!userId.value) return
  router.push(`/${userId.value}`)
}

// Hooks
useTitle("Lanyard Visualizer")
useFavicon("/logo.png")

onStartTyping(() => {
  inputElement?.value?.focus()
})
</script>

<template>
  <div>
    <header class="h-screen relative grid place-items-center p-8 md:p-16">
      <div
        v-motion-fade
        class="absolute -z-1 overflow-hidden pointer-events-none inset-0 grid place-items-center"
      >
        <img
          src="/header-background.png"
          alt="Stylistic header background"
          class="object-cover h-full w-full max-w-screen max-h-screen opacity-10"
        />
      </div>

      <div v-motion-fade :delay="300" class="flex flex-col items-center gap-6">
        <img src="/logo.png" alt="Lanyard logo" class="w-24 h-24" />

        <h1
          class="text-5xl md:text-7xl font-bold bg-gradient-to-tl from-gray-50 via-gray-100 to-gray-200 bg-clip-text text-transparent text-center"
        >
          <span class="block">Lanyard</span>
          <span class="block">Visualizer</span>
        </h1>

        <p class="text-white/50 md:text-lg md:w-2/3 text-center font-medium">
          A proof-of-concept example to show what you can build with Lanyard
          API.
        </p>

        <div class="relative w-full md:w-1/2 flex justify-center">
          <input
            v-model="userId"
            ref="inputElement"
            class="appearance-none pl-3 pr-20 placeholder-white/20 w-full bg-transparent outline-none py-2 border-[1.5px] border-white/10 hover:border-white/20 focus:border-white/30 transition-all rounded-lg"
            placeholder="Enter your Discord user ID"
            @focus="inputFocused = true"
            @blur="inputFocused = false"
            @keydown.enter="handleSubmit"
          />

          <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button
              type="button"
              class="text-white/20 font-medium select-none hover:text-white/40 transition-colors text-xs uppercase"
              :class="userId.length >= 18 && 'text-white/40'"
              @click="handleSubmit"
            >
              Submit
            </button>
          </div>
        </div>

        <div class="flex space-x-4 text-xl md:text-base text-white/50">
          <a
            href="https://github.com/eggsy/lanyard-visualizer"
            target="_blank"
            title="Visit GitHub repository"
          >
            <IconGithub class="hover:text-white transition-colors" />
          </a>

          <a
            href="https://eggsy.xyz"
            target="_blank"
            title="Visit developer's website"
          >
            <IconLink class="hover:text-white transition-colors" />
          </a>
        </div>
      </div>
    </header>
  </div>
</template>

<style lang="scss">
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>
