<template>
  <div class="ml-2 mr-2">
    <h3>Stats & Charts</h3>
    <!-- {{store.db.info}} -->
    <!-- {{store.db.facets.era}} -->
    <div class="grid">
      <div class="col">
        <div class="card">
          <h4>Editions by Epoch</h4>
          <Chart type="bar" :data="periodData" :options="periodOptions" :height="190" />
        </div>
      </div>
      <div class="col">
        <div class="card" style="max-height: 200px; min-height: 250px">
          <h4>Subjects</h4>
          <Chart type="pie" :data="subjectData" :options="subjectOptions" :width="355" />
        </div>
      </div>
    </div>
    <div class="card">
      <h4>Publication Years</h4>
      <Chart type="bar" :data="stackedData" :options="stackedOptions" />
    </div>
    <div class="card">
      <h4>Content Types Distribution</h4>
      <div>
        Genres are grouped by types into 1) work-oriented editions (single work, collected works, collections of texts),
        2) material-oriented editions (single manuscript, papers), 3) text types (letters, charters, inscriptions etc.).
        Every group is rendered in different color.
      </div>
      <Chart type="bar" :data="matData" :options="genresOptions" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted, onUnmounted, unref } from 'vue';
import Chart from 'primevue/chart';
import store from '../store';

const era = store.db.choices.filter((x: any) => x.label === 'era')?.[0]?.items;
const material = store.db.choices.filter((x: any) => x.label === 'material')?.[0]?.items;
const subject = store.db.choices.filter((x: any) => x.label === 'subject')?.[0]?.items;

const eraInfo = Object.keys(era)
  .map((x: any) => [era[x].code, era[x].title, era[x].num, store.db.info.era[era[x].code][2]])
  .sort((a, b) => a[3] - b[3]);

const subjectInfo = Object.keys(subject)
  .map((x: any) => [subject[x].code, subject[x].title, subject[x].num])
  .sort((a, b) => a[2] - b[2]);

const workOriented = 'rgba(50, 50, 50, 0.4)';
// const matOriented = 'rgba(255, 205, 86, 0.2)';
const matOriented = 'rgba(50, 50, 50, 0.6)';
const textTypes = 'rgba(201, 203, 207, 0.2)';

const matColors = {
  single_work: workOriented,
  collected_works: workOriented,
  collection_of_texts: workOriented,

  single_manuscript: matOriented,
  papers: matOriented,

  letters: textTypes,
  charters: textTypes,
  inscriptions: textTypes,
  diary: textTypes,
  serial_documents: textTypes,
} as keyable;

const matInfo = Object.keys(material)
  .map((x: any) => [material[x].code, material[x].title, material[x].num, matColors[material[x].code]])
  .sort((a, b) => a[2] - b[2]);

const subjectData = ref({
  labels: subjectInfo.map(x => x[1]),
  datasets: [
    {
      label: ' Total',
      borderColor: 'rgba(50, 50, 50, 0.2)',
      backgroundColor: [
        'white',
        'rgba(50, 50, 50, 1)',
        'rgba(50, 50, 50, 0.2)',
        'rgba(50, 50, 50, 0.8)',
        'rgba(50, 50, 50, 0.4)',
        'rgba(50, 50, 50, 0.6)',
      ],
      //   hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D'],
      data: subjectInfo.map(x => x[2]),
    },
  ],
});

const matData = ref({
  labels: matInfo.map(x => x[1]),
  datasets: [
    {
      label: ' Total',
      backgroundColor: matInfo.map(x => x[3]),
      borderColor: 'rgb(201, 203, 207)',
      borderWidth: 1,
      data: matInfo.map(x => x[2]),
    },
  ],
});

const periodData = ref({
  labels: eraInfo.map(x => x[1]),
  datasets: [
    {
      label: ' Total',
      backgroundColor: 'rgba(201, 203, 207, 0.7)',
      borderColor: 'rgb(201, 203, 207)',
      borderWidth: 1,
      data: eraInfo.map(x => x[2]),
    },
  ],
});

const periodOptions = ref({
  responsive: false,
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false,
      labels: {
        color: '#495057',
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#495057',
      },
      grid: {
        color: '#ebedef',
      },
    },
    y: {
      ticks: {
        color: '#495057',
        autoSkip: false,
      },
      grid: {
        color: '#ebedef',
      },
    },
  },
});

const subjectOptions = ref({
  responsive: false,
  plugins: {
    legend: {
      // display: false,
      position: "left",
      labels: {
        color: '#495057',
      },
    },
  },
});

const genresOptions = ref({
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false,
      labels: {
        color: '#495057',
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#495057',
      },
      grid: {
        color: '#ebedef',
      },
    },
    y: {
      ticks: {
        color: '#495057',
        autoSkip: false,
      },
      grid: {
        color: '#ebedef',
      },
    },
  },
});

const stackedData = ref({
  labels: Object.keys(store.db.stats.years.activities),
  datasets: [
    {
      type: 'bar',
      label: ' First publications',
      backgroundColor: 'rgba(73, 80, 87, 0.7)',
      data: Object.values(store.db.stats.years.pubs),
    },
    {
      type: 'bar',
      label: ' Relaunches',
      backgroundColor: 'rgba(201, 203, 207, 0.7)',
      data: Object.values(store.db.stats.years.activities),
    },
  ],
});

const stackedOptions = ref({
  //   indexAxis: 'y',
  plugins: {
    tooltip: {
      mode: 'index',
      intersect: false,
    },
    legend: {
      display: false,
      labels: {
        color: '#495057',
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: '#495057',
      },
      grid: {
        color: '#ebedef',
      },
    },
    y: {
      //   afterFit(scale: any) {
      //     scale.width = 90;
      //   },
      stacked: true,
      ticks: {
        autoSkip: false,
        color: '#495057',
      },
      grid: {
        color: '#ebedef',
      },
    },
  },
});
</script>
