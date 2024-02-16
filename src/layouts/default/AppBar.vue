<template>
  <v-app-bar flat>
    <v-app-bar-title>
      TMS Stat tools: {{appStore.target}}
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-logout" @click="appStore.logout()"></v-btn>
    </template>
  </v-app-bar>


</template>

<script lang="ts" setup>
import {useAppStore} from "@/store/app";

const appStore = useAppStore()
</script>
