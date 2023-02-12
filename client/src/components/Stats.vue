<template>
  <div class="ml-4">
    <h3>Stats & Charts</h3>
    <!-- {{db.info}} -->
    <!-- {{db.facets.era}} -->

    <div class="card">
      <h4>Editions by Epoch</h4>
      <Chart type="bar" :data="basicData" :options="horizontalOptions" />
    </div>
    <div class="card">
      <h4>Publication Years</h4>
      <Chart type="bar" :data="stackedData" :options="stackedOptions"  />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted, onUnmounted, unref } from 'vue';
import Chart from 'primevue/chart';

import catalog from '../../../server/data/catalog.json';
const db = catalog as keyable;
const era = db.choices.filter((x: any) => x.label === 'era')?.[0]?.items;
const eraInfo = Object.keys(era)
  .map((x: any) => [era[x].code, era[x].title, era[x].num, db.info.era[era[x].code][2]])
  .sort((a, b) => a[3] - b[3]);

const basicData = ref({
  labels: eraInfo.map(x => x[1]),
  datasets: [
    {
      label: ' Total',
      backgroundColor: 'rgba(201, 203, 207, 0.5)',
      borderColor: 'rgb(201, 203, 207)',
      borderWidth: 1,
      data: eraInfo.map(x => x[2]),
    },
  ],
});

const horizontalOptions = ref({
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
  labels: Object.keys(db.stats.years.activities),
  datasets: [
    {
      type: 'bar',
      label: ' First publications',
      backgroundColor: 'rgba(73, 80, 87, 0.7)',
      data: Object.values(db.stats.years.pubs),
    },
    {
      type: 'bar',
      label: ' Relaunches',
      backgroundColor: 'rgba(201, 203, 207, 0.7)',
      data: Object.values(db.stats.years.activities),
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
