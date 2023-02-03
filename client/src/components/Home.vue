<template>
  <div class="home">
    <div v-if="isLoaded" style="margin: auto">
      <h4>
        {{ Object.keys(data).length }} projects. Updated {{ new Date(gitData.last_activity_at).toLocaleDateString() }}
      </h4>
      <!-- 
        <n-select v-model:value="search" multiple :options="[
        {
          label: 'Everybodys',
          value: 'song0',
        },]" /> -->

      <Card v-for="unit in Object.keys(data).reverse().slice(0, 50)">
        <!-- <template #header> !!! </template> -->
        <template #title> {{ data[unit].title }} </template>
        <template #content>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam
          deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque quas!
          <div class="flex align-items-center flex-column sm:flex-row">
            <Chip :label="data[unit].material" class="mr-2 mb-2" />
            <Chip v-for="lang in data[unit].language" :label="lang" class="mr-2 mb-2" />
            <Chip v-for="subj in data[unit].subject" :label="subj" class="mr-2 mb-2" />
            <Chip v-for="er in data[unit].era" :label="er" class="mb-2" />
          </div>
        </template>
      </Card>
    </div>
    <div v-else style="text-align: center">...loading</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import axios from 'axios';
import Chip from 'primevue/chip/sfc';
import Card from 'primevue/card/sfc';

const data = reactive({});
// import project from '../../package.json';
// import store from '../store';

const search = ref();

const isLoaded = ref(false);
const gitData = reactive({});

onBeforeMount(async () => {
  const response = await axios.get('/api/projects');
  // console.log(response.data);
  Object.assign(data, response.data);
  isLoaded.value = true;

  const gitResponse = await axios.get('https://git.uni-wuppertal.de/api/v4/projects/749');
  console.log(gitResponse.data);
  Object.assign(gitData, gitResponse.data);
});
</script>
