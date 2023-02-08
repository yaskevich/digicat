<template>
  <div class="container">
    <router-view />
  </div>
</template>
<script setup lang="ts">
import router from './router';
import { RouterLink, useRoute } from 'vue-router';
import { h, Component, ref, reactive, onBeforeMount, onMounted, computed, watch } from 'vue';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
// import store from './store';
// const vuerouter = useRoute();
const activeKey = ref<string | null>(null); // vuerouter?.name||'Home'
// const loggedIn = computed(() => store?.state?.token?.length);
// const access = ref(false);

// onBeforeMount(async () => {
// const response = await axios.get('/api/data');
// console.log(response.data);
// });
</script>

<style lang="scss">
#app,
.p-inputtext,
.p-component {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: 'Roboto Condensed', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

//
.p-chip {
  border-radius: 6px !important;
  &.language {
    color: white;
    background: #000380;
  }
  &.material {
    color: white;
    background: #3b6ea1;
  }
  &.subject {
    color: white;
    background: #2196f3;
  }
  &.era {
    color: #e7deb1;
    background: #342f87;
  }
}
.p-chip-text {
  font-size: 0.65rem !important;
  font-weight: bold !important;
  margin-bottom: 0 !important;
  text-transform: uppercase;
}

.p-card-title {
  font-weight: 500 !important;
}

#nav {
  padding: 30px;
  // text-align: center;

  a {
    color: #2c3e50;

    &.router-link-exact-active,
    &.router-link-active {
      color: #42b983;
    }
  }
}

.nav {
  margin-right: 5px;
}
#content {
  display: flex;
  flex-direction: column;
  min-height: 97vh;
  max-width: 100vh;
  /* max-width: 800px; */
  margin: auto;
}
.left {
  text-align: left;
}

.minimal {
  max-width: 600px;
  margin: auto;
}

.container {
  max-width: 900px;
  margin: auto;
}
</style>
