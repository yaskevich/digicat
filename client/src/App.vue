<template>
  <div class="container">
    <div>
      <Menubar :model="items" class="header">
        <template #start>
          <router-link :to="{ name: 'Home' }">
            <img alt="Project logo" title="Home page" :src="logo" height="40" class="mr-2" style="filter: invert(1)" />
          </router-link>
          <!-- <img alt="logo" src="assets/DH-BUW-Logo_Editionenkatalog.png" height="40" class="mr-2" />
          <img alt="logo" src="assets/GRK-Logo_weiss.png" height="40" class="mr-2" /> -->
          <!-- <img alt="logo" src="assets/ide.png" height="40" class="mr-2" /> -->
        </template>
        <template #end>
          <div class="p-inputgroup" v-show="$route.path === '/'">
            <Button class="p-button-secondary" icon="pi pi-trash" @click="clearSearch" />
            <InputText placeholder="Search by title" type="text" v-model="term" @change="search" />
            <Button icon="pi pi-search" class="p-button-secondary" @click="search" />
          </div>
        </template>
      </Menubar>
    </div>
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
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
const logo = new URL('./assets/BUW_Logo-weiss.png', import.meta.url).href;

const vuerouter = useRoute();
const term = ref('');

const clearSearch = () => {
  term.value = '';
  search();
};

const search = () => {
  // console.log('search', term.value);
  term.value ? router.replace({ path: '/', query: { search: term.value } }) : router.replace({ path: '/' });
};

onMounted(() => {
  console.log('mount app');

  if (vuerouter.query.search) {
    console.log('set', vuerouter.query.search);
    term.value = String(vuerouter.query.search);
  }
});

const items = ref([
  {
    label: 'Charts',
    icon: 'pi pi-fw pi-chart-bar',
    // items: [
    //   {
    //     label: 'Charts',
    //     icon: 'pi pi-fw pi-align-left',
    //   },
    //   {
    //     label: 'About',
    //     icon: 'pi pi-fw pi-align-right',
    //   },
    // ],
  },
  // {
  //   separator: true,
  // },
  // {
  //   label: 'Item 2',
  //   disabled: true,
  // },
  {
    label: 'About',
    icon: 'pi pi-fw pi-info-circle',
    to: '/about',
  },
]);

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
  // color: #2c3e50;
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

:deep(.header) {
  background-color: #333333;
}
</style>
