<script setup lang="ts">
import {useAppStore} from "@/store/app";
import {ref} from "vue";
import providerService from "@/service/provider/ProviderService";
import {useProviderStore} from "@/store/provider";
import router from "@/router";
import http from "@/service/rest";
import {Provider} from "@/dto/provider/Provider";

const appStore = useAppStore();
const providerStore = useProviderStore();
const wait = ref<boolean>(false);
const url = ref<string>(appStore.target);
const username = ref<string>();
const password = ref<string>();
function login(){
  if(url.value && username.value && password.value) {
    appStore.target = url.value;
    appStore.token = btoa(username.value + ":" + password.value);

    http.defaults.baseURL = appStore.target;
    wait.value = true;

    providerService.collectionAll<Provider>({sort:[], enabled:null})
      .then((providers: Provider[])=>{
          providerStore.setProviders(providers)
          router.push({name: 'stat'});
        })
      .catch((error)=>{
        console.dir(error);
      })
      .finally(()=>{
        wait.value = false;
      })
  }
}
</script>

<template>
  <div class="d-flex align-center justify-center" style="height: 100vh">

    <v-progress-circular
      indeterminate
      color="primary"
      v-show="wait"
    ></v-progress-circular>

    <v-sheet v-show="!wait"  width="400" class="mx-auto">

        <v-card>
          <v-card-title>
            TMS Stat view tool
          </v-card-title>
          <v-card-text>
            <v-col>
              <v-form fast-fail @submit.prevent="login">
                <v-text-field variant="outlined" v-model="url" label="URL"></v-text-field>
                <v-text-field variant="outlined" v-model="username" label="Username"></v-text-field>
                <v-text-field type="password" variant="outlined" v-model="password" label="Password"></v-text-field>
                <v-btn @click="login" type="submit" color="primary" :block="true" class="mt-2">Sign in</v-btn>
              </v-form>
            </v-col>
          </v-card-text>
          <v-card-subtitle><v-btn href="https://github.com/tvip/tms-stat-viewer-example" :flat="true" icon="mdi-github"></v-btn> </v-card-subtitle>
        </v-card>
    </v-sheet>
  </div>
</template>

<style scoped>

</style>
