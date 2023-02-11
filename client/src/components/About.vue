<template>
  <div class="about ml-4">
    <!-- <h1>This is an about page</h1>  -->
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <h3>Catalog of Digital Editions</h3>
    <h4>Institutions</h4>

    <div class="card">
      <div class="flex justify-content-left flex-wrap card-container yellow-container" v-for="site in institutions">
        <div
          class="flex align-items-center justify-content-left font-bold text-gray-900 border-round m-2"
          style="min-width: 200px">
          <img height="40" :alt="site[1]" :src="site[0]" style="filter: invert(1)" />
        </div>
        <div class="flex align-items-center justify-content-left font-bold text-gray-900 border-round m-2">
          {{ site[1] }}
        </div>
      </div>
    </div>

    <h4>Persons</h4>

    <div class="card">
      <div class="card-container indigo-container overflow-hidden">
        <div class="flex mb-1" v-for="(person, index) in persons">
          <div
            class="flex-1 md:flex-none flex align-items-center justify-content-center font-bold ">
            <!-- <img :src="logo" height="40" style="filter: invert(1); max-height: 15rem; text-align: left" /> -->
            <Avatar icon="pi pi-user" size="xlarge" />
          </div>
          <div
            class="flex-1 md:flex-none flex align-items-center justify-content-left font-bold pl-2" style="min-width:170px">
            {{ person[0] }}
          </div>
          <div
            class="flex-1 md:flex- m-2 pxnone flex align-items-center justify-content-right ">
            {{ person[1] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from 'primevue/avatar';

const institutions = [
  ['ide.png', 'Institut für Dokumentologie und Editorik '],
  ['GRK-Logo_weiss.png', 'Dokument – Text – Edition'],
  ['BUW_Logo-weiss.png', 'Bergische Universität Wuppertal'],
  ['DH-BUW-Logo_Editionenkatalog.png', '???? ???? ????'],
].map(x => [new URL('../assets/' + x[0], import.meta.url).href, x[1]]);

const persons = [
  ['Patrick Sahle', 'project direction'],
  ['Nadine Sutor', 'various support 2020ff'],
  ['Stephan Makowski', 'technical system 2020ff'],
  ['Jana Klinger', 'catalog entries 2019ff'],
  ['Georg Vogeler', 'contributions 1998ff'],
  // ['John Doe', 'Abbaye de Thélème'],
];
</script>
