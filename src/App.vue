<template>

  <v-snackbar v-model="apiStore.loading">
    <v-progress-linear class="elevation-1" :indeterminate="true"></v-progress-linear>
  </v-snackbar>
  <v-snackbar v-model="apiStore.showError">
    {{ apiStore.error?.code }}: {{apiStore.error?.message}}
    <template v-slot:actions>
      <v-btn
        color="pink"
        icon="mdi-close"
        @click="apiStore.eraseError()"
      >
      </v-btn>
    </template>
  </v-snackbar>
  <router-view />
</template>

<script lang="ts" setup>
import {useApiStore} from "@/store/api";

const apiStore = useApiStore();

</script>
