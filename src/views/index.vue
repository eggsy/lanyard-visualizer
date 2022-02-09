<script lang="ts" setup>
import { onStartTyping, useTitle } from "@vueuse/core"
import { useRoute, useRouter } from "vue-router"
import { computed, ref } from "vue"

// Types
import type { Ref } from "vue"

// Components
import Card from "../components/Card.vue"

// References
const userId = ref("")
const input: Ref<HTMLInputElement | null> = ref(null)

// Get query from the route
const { push } = useRouter()
const { query } = useRoute()

// Computed methods
const getTarget = computed(() => {
  if (userId.value !== "") {
    return {
      query,
      name: "User",
      params: {
        id: userId.value,
      },
    }
  } else return { name: "Home", query }
})

// Hooks
useTitle("Lanyard Visualizer")

onStartTyping(() => {
  input?.value?.focus()
})
</script>

<template>
  <div class="grid gap-12 items-center md:grid-cols-2">
    <div class="flex flex-col space-y-4 text-center md:text-left">
      <div>
        <h1 class="font-bold text-shadow-md text-white text-2xl md:text-4xl">
          Lanyard Visualizer
        </h1>

        <p class="text-shadow-sm md:w-4/5">
          <a
            href="https://lanyard.rest/discord"
            title="Join Discord"
            target="_blank"
            rel="noreferrer"
            class="underline"
            >Lanyard</a
          >
          visualizer example built with Vue, Vite, TypeScript and Windi CSS
        </p>
      </div>

      <div class="flex flex-col space-y-2">
        <input
          ref="input"
          v-model="userId"
          placeholder="Enter Discord user ID..."
          class="rounded-lg outline-none bg-opacity-30 bg-gray-200 py-2 px-4 placeholder-gray-100 transition-all ring-gray-600/30 text-gray-100 appearence-none md:w-3/4 focus:(ring-2)"
          autocomplete="on"
          type="text"
          @keyup.enter="push(getTarget)"
        />

        <router-link :to="getTarget" class="text-center btn md:w-max"
          >Submit</router-link
        >
      </div>
    </div>

    <Card
      name="Lanyard Visualizer"
      details="by EGGSY"
      state="on GitHub, open-source"
      :timestamps="{ start: new Date().getTime() }"
    />
  </div>
</template>
