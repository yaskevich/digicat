<template>
  <div class="home">
    <div v-if="isLoaded" style="margin: auto">
      <div class="ml-4">
        <h4>
          {{ Object.keys(db.projects).length }} items. Updated
          {{ new Date(db.gitlab.last_activity_at).toLocaleDateString() }}. Project by Patrick Sahle et al.
        </h4>
        <h4>
          Selected: {{ allKeys.length === matches.length ? allKeys.length : matches.length + ' of ' + allKeys.length }}.
          <span v-if="$route.query.search"> Search term «{{ $route.query.search }}» </span>
        </h4>
      </div>

      <!-- {{ selection }} -->
      <div class="mb-2">
        <MultiSelect
          v-model="selection"
          @change="updateFacet"
          :filter="true"
          display="chip"
          :options="db.choices"
          optionLabel="label"
          optionGroupLabel="label"
          optionGroupChildren="items"
          class="choices"
          placeholder="Select project features">
          <template #optiongroup="slotProps">
            <div class="flex align-items-center country-item">
              <i :class="`pi ${icons[slotProps.option.label]} mr-2`"></i>
              <!-- <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" class="mr-2" width="18" /> -->
              <div style="text-transform: capitalize">{{ slotProps.option.label }}</div>
            </div>
          </template>
        </MultiSelect>
      </div>

      <!-- <VirtualScroller :items="matches" :itemSize="50" scrollHeight="1000px">
        <template v-slot:item="{ item, options }"> -->
      <!-- <div :class="['scroll-item p-2', { odd: options.odd }]" style="height: 50px">{{ data[item].title }}</div> -->
      <div ref="scrollComponent">
        <Card v-for="item in matches.slice(0, limit)" class="mb-2">
          <!-- <template #header> !!! </template> -->
          <template #title>
            <a :href="db.projects[item].url" target="_blank" class="pr-1"><i class="pi pi-external-link"></i></a>
            {{ db.projects[item].title }}
          </template>
          <template #subtitle> {{ db.projects[item].edition }} </template>

          <template #content>
            {{ db.projects[item].description }}
            <div>
              Catalog entry:
              <a style="text-decoration: none" :href="'https://digitale-edition.de/' + db.projects[item].id"
                >{{ db.projects[item].id }}
              </a>
            </div>
          </template>

          <template #footer>
            <div class="flex md:justify-content-start flex-wrap">
              <div class="flex align-items-start mt-1">
                <Chip
                  v-for="mat in db.projects[item].material"
                  :label="db.info.material[mat][0]"
                  class="material mr-1" />
                <!-- <Chip :label="db.info.material[db.projects[item].material][0]" class="material mr-2" /> -->
              </div>
              <div class="flex align-items-start mt-1">
                <Chip
                  v-for="lang in db.projects[item].language"
                  :label="db.languages?.[lang]?.name || 'ERROR'"
                  class="language mr-1" />
              </div>
              <div class="flex align-items-start mt-1">
                <Chip
                  v-for="subj in db.projects[item].subject"
                  :label="db.info.subject[subj][0]"
                  class="subject mr-1" />
              </div>
              <div class="flex align-items-start mt-1">
                <Chip v-for="period in db.projects[item].era" :label="db.info.era[period][0]" class="era mr-1" />
              </div>
            </div>
          </template>
        </Card>
      </div>
      <!-- </template>
      </VirtualScroller> -->
    </div>
    <div v-else style="text-align: center">...loading</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted, onUnmounted, unref } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import axios from 'axios';
import Chip from 'primevue/chip';
import Card from 'primevue/card';
// import VirtualScroller from 'primevue/virtualscroller';
import MultiSelect from 'primevue/multiselect';
// import store from '../store';
import project from '../../package.json';
import catalog from '../../../server/data/catalog.json';
// console.log(db);
const selection = ref([]);
// const data = reactive({} as keyable);
// const projects = reactive({} as keyable);
// const languages = reactive({} as keyable);
// const choices = reactive([]);
const db = catalog as keyable;
const isLoaded = ref(false);
const gitData = reactive({});
const scrollComponent = ref(null);
const vuerouter = useRoute();
const matches = ref<Array<string>>([]);
const limit = ref(10);
const allKeys = ref<Array<string>>([]);

const term = ref('');

///////////////////////////////////////////////////////////////////
// static load
allKeys.value = Object.keys(db.projects).reverse();
// matches.value = allKeys.value;

// static load
///////////////////////////////////////////////////////////////////

const updateFacet = () => {
  limit.value = 10;
  matches.value = selection.value?.length ? allKeys.value.filter(x => match(x)).reverse() : allKeys.value;

  if (term.value) {
    // console.log(term.value, matches.value.length);
    let pattern = new RegExp(term.value, 'i');
    matches.value = matches.value.filter(id => pattern.test(db.projects[id].title));
    // console.log('now', matches.value.length);
  }
};

const match = (id: any) => {
  const proj = db.projects[id];

  if (selection.value?.length) {
    // const condMat = selection.value.filter((x: any) => x.parent === 'material').map((x: any) => x.code);
    // if (condMat.length && !condMat.includes(proj.material)) {
    //   return false;
    // }
    for (let prop of ['era', 'subject', 'language', 'material']) {
      const condition = selection.value.filter((x: any) => x.parent === prop).map((x: any) => x.code);
      if (condition.length && !condition.some((x: any) => proj[prop].includes(x))) {
        return false;
      }
    }
  }

  return true;
};

const icons = {
  material: 'pi-file-edit',
  era: 'pi-calendar',
  subject: 'pi-eye',
  language: 'pi-language',
} as keyable;

onBeforeRouteUpdate(async (to, from) => {
  console.log('update route', from.fullPath, '→', to.fullPath);
  term.value = to.query.search ? String(to.query.search) : '';
  updateFacet();
  // if (to?.params?.page) {
  //   // console.log('-> update params');
  //   page.value = Number(to.params.page);
  //   pageSize.value = Number(to.params.batch);
  // }
  // if (from?.params?.page) {
  //   // console.log('-> call update');
  //   await updatePage();
  // }
});

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // console.log('mount Home', vuerouter.query.search);
  if (vuerouter.query.search) {
    term.value = String(unref(vuerouter.query.search));
  }
  updateFacet();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleScroll = () => {
  if (scrollComponent.value) {
    let element = scrollComponent.value as HTMLInputElement;
    if (element && element.getBoundingClientRect().bottom < window.innerHeight) {
      console.log(`${limit.value} of ${matches.value.length}`);
      if (matches.value.length > limit.value) {
        console.log('load more');
        limit.value += 10;
      }
    }
  }
};

// const setLabel = (parent: string, unit: string) => {
//   let result = '';
//   if (parent === 'language') {
//     if (languages?.[unit]?.name) {
//       result = `${languages[unit].name} / ${languages[unit].local}`;
//     }
//   } else {
//     if (info?.[parent]?.[unit]?.[0]) {
//       result = info?.[parent]?.[unit]?.[0];
//     }
//   }
//   if (!result) {
//     result = `!!! ${unit}`;
//   }
//   return `${result} (${data[parent][unit].length})`;
// };

onBeforeMount(async () => {
  // const gitResponse = await axios.get('https://git.uni-wuppertal.de/api/v4/projects/749');
  // console.log(gitResponse.data);
  // Object.assign(gitData, gitResponse.data);
  // const response = await axios.get('/api/projects');
  // // console.log(response.data);
  // Object.assign(projects, response.data);
  // const dataResponse = await axios.get('/api/data');
  // Object.assign(data, dataResponse.data);
  // console.log(dataResponse);
  // const langResponse = await axios.get('/api/languages');
  // // console.log(response.data);
  // Object.assign(languages, langResponse.data);
  // // console.log(languages);
  // Object.assign(
  //   choices,
  //   Object.keys(data).map(x => ({
  //     label: x,
  //     items: Object.keys(data[x]).map(y => ({
  //       code: y,
  //       parent: x,
  //       num: dataResponse.data[x][y].length,
  //       label: setLabel(x, y),
  //     })),
  //   }))
  // );
  // allKeys.value = Object.keys(projects);
  // matches.value = allKeys.value;
  isLoaded.value = true;
});
</script>

<style lang="scss">
.choices {
  display: flex !important;
}
</style>
