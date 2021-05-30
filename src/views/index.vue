<template>
  <div class="grid md:grid-cols-2 items-center gap-12">
    <div class="flex text-center md:text-left flex-col space-y-4">
      <div>
        <h1 class="text-2xl md:text-4xl font-bold text-shadow-md text-white">
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
          placeholder="Enter user ID..."
          class="appearence-none hover:(shadow-lg) text-gray-100 bg-opacity-30 rounded-lg px-4 py-2 bg-gray-200 outline-none transition-all placeholder-gray-100 focus:(shadow-lg) md:w-3/4"
          autocomplete="on"
          type="text"
        />

        <router-link
          :to="
            userId !== ''
              ? {
                  name: 'User',
                  params: {
                    id: userId
                  },
                  query
                }
              : { name: 'Home' }
          "
          class="btn text-center md:w-max"
          >Submit</router-link
        >
      </div>
    </div>

    <div>
      <Card
        name="Lanyard Visualizer"
        details="by EGGSY"
        state="on GitHub, open-source"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onStartTyping, useTitle } from "@vueuse/core";
import { useRoute } from "vue-router";
import { ref } from "vue";

// Types
import type { Ref } from "vue"

// Components
import Card from "../components/Card.vue";

// References
const userId = ref("");
const input: Ref<HTMLInputElement | null> = ref(null);

// Get query from the route
const { query } = useRoute()

// Hooks
useTitle("Lanyard Visualizer")

onStartTyping(() => {
  input?.value?.focus();
});
</script>
