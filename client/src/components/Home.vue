<template>
  <div class="home">
    <div v-if="isLoaded" style="margin: auto">
      <h4>
        {{ Object.keys(projects).length }} projects. Updated
        {{ new Date(gitData.last_activity_at).toLocaleDateString() }}
      </h4>

      <!-- {{ selection }} -->
      <div class="mb-2">
        <h5>Selected: {{ allKeys.length === matches.length ? allKeys.length : matches.length + ' of ' + allKeys.length }}</h5>
        <MultiSelect
          v-model="selection"
          @change="updateFacet"
          :filter="true"
          display="chip"
          :options="choices"
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
            <a :href="projects[item].url" target="_blank" class="pr-1"><i class="pi pi-external-link"></i></a>
            {{ projects[item].title }}
          </template>
          <template #subtitle> {{ projects[item].edition }} </template>

          <template #content>
            {{ projects[item].description }}
            <div>
              Catalog entry:
              <a style="text-decoration: none" :href="'https://digitale-edition.de/' + projects[item].id"
                >{{ projects[item].id }}
              </a>
            </div>
          </template>

          <template #footer>
            <div class="flex md:justify-content-start flex-wrap">
              <div class="flex align-items-start">
                <Chip :label="info.material[projects[item].material][0]" class="material mr-2" />
              </div>
              <div class="flex align-items-start">
                <Chip
                  v-for="lang in projects[item].language"
                  :label="languages?.[lang]?.name || 'ERROR'"
                  class="language mr-1" />
              </div>
              <div class="flex align-items-start">
                <Chip v-for="subj in projects[item].subject" :label="info.subject[subj][0]" class="subject mr-1" />
              </div>
              <div class="flex align-items-start">
                <Chip v-for="period in projects[item].era" :label="info.era[period][0]" class="era mr-1" />
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
import { ref, reactive, onBeforeMount, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import Chip from 'primevue/chip';
import Card from 'primevue/card';
// import VirtualScroller from 'primevue/virtualscroller';
import MultiSelect from 'primevue/multiselect';
// import project from '../../package.json';
// import store from '../store';
const selection = ref([]);
const data = reactive({} as keyable);
const projects = reactive({} as keyable);
const languages = reactive({} as keyable);
const choices = reactive([]);
const isLoaded = ref(false);
const gitData = reactive({});
const scrollComponent = ref(null);
const matches = ref<Array<string>>([]);
const limit = ref(10);
const allKeys = ref<Array<string>>([]);

const updateFacet = () => {
  limit.value = 10;
  matches.value = selection.value?.length ? allKeys.value.filter(x => match(x)).reverse() : allKeys.value;
  // console.log('search', matches.value.length);
};

const match = (id: any) => {
  const proj = projects[id];

  if (selection.value?.length) {
    const condMat = selection.value.filter((x: any) => x.parent === 'material').map((x: any) => x.code);
    if (condMat.length && !condMat.includes(proj.material)) {
      return false;
    }
    for (let prop of ['era', 'subject', 'language']) {
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

const info = reactive({
  material: {
    charters: [
      'Charters',
      'medieval and early modern deeds, including cartularies (which are not single manuscript therefore)',
    ],
    single_manuscript: ['Single Manuscript', 'include also multi volume series; author manuscripts under single works'],
    collection_of_texts: ['Collection of Texts', 'different texts by different authors'],
    papers: ['Papers', 'documents related to a person or other entity or topic; a Nachlass'],
    diary: ['Diaries', 'note: diaries are not single manuscripts'],
    collected_works: ['Collected Works', 'all works by a specific author'],
    single_work: ['Single Work', 'a specific work with all its expressions, editions, manuscripts'],
    serial_documents: [
      'Serial Documents',
      'documents of/with similar content and/or form (e.g. entries, records etc.)',
    ],
    letters: ['Letters', 'correspondence documents'],
    inscriptions: ['Inscriptions', 'epigraphic documents'],
  },
  era: {
    ancient: ['Antiquity'],
    early_ma: ['Early MA'],
    high_ma: ['High MA'],
    late_ma: ['Late MA'],
    early_m: ['Early Modern'],
    modern: ['Modern'],
  },
  subject: {
    history: ['History'],
    literature: ['Literature'],
    history_science: ['History of Science'],
    philosophy: ['Theology & Philosophy'],
    music: ['Music'],
    history_art: ['History of Art'],
  },
} as keyable);

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
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

const setLabel = (parent: string, unit: string) => {
  let result = '';
  if (parent === 'language') {
    if (languages?.[unit]?.name) {
      result = `${languages[unit].name} / ${languages[unit].local}`;
    }
  } else {
    if (info?.[parent]?.[unit]?.[0]) {
      result = info?.[parent]?.[unit]?.[0];
    }
  }
  if (!result) {
    result = `!!! ${unit}`;
  }
  return `${result} (${data[parent][unit].length})`;
};

onBeforeMount(async () => {
  const response = await axios.get('/api/projects');
  // console.log(response.data);
  Object.assign(projects, response.data);

  const dataResponse = await axios.get('/api/data');
  Object.assign(data, dataResponse.data);
  console.log(dataResponse);

  const langResponse = await axios.get('/api/languages');
  // console.log(response.data);
  Object.assign(languages, langResponse.data);
  // console.log(languages);

  Object.assign(
    choices,
    Object.keys(data).map(x => ({
      label: x,
      items: Object.keys(data[x]).map(y => ({
        code: y,
        parent: x,
        num: dataResponse.data[x][y].length,
        label: setLabel(x, y),
      })),
    }))
  );

  const gitResponse = await axios.get('https://git.uni-wuppertal.de/api/v4/projects/749');
  console.log(gitResponse.data);
  Object.assign(gitData, gitResponse.data);

  allKeys.value = Object.keys(projects);
  matches.value = allKeys.value;
  isLoaded.value = true;
});
</script>

<style lang="scss">
.choices {
  display: flex;
}
</style>
