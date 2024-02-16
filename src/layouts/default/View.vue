<template>
  <v-main>
    <v-container>
    <router-view />
    </v-container>
  </v-main>
  <v-bottom-sheet>

    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" text="Logs"></v-btn>
    </template>
    <v-card>
    <v-card-title>
      Logs
    </v-card-title>
      <v-card-text>
        <v-virtual-scroll
          :height="300"
          :items="logStore.logs"
        >
          <template v-slot:default="{ item }">
            <v-icon icon="mdi-alert" v-if="item.level == LogLevel.warning"></v-icon> <p>{{dayjs(item.date).format('HH:mm:ss') + ": " + item.message}}</p>
          </template>
        </v-virtual-scroll>
        <v-card-actions>
          <v-btn @click="erase" icon="mdi-delete"></v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>


  </v-bottom-sheet>
</template>

<script lang="ts" setup>
import {LogLevel, useLogStore} from "@/store/log";
import dayjs from "dayjs";
import {useChannelStore} from "@/store/channel";
const logStore = useLogStore();
const channelStore = useChannelStore();
channelStore.init();


function erase(){
  logStore.erase();
  console.dir(logStore.logs);
}

</script>
