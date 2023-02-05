import { createApp } from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import JsonViewer from 'vue-json-viewer'

import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';

import PrimeVue from 'primevue/config';

import "@fontsource/roboto-condensed" // Defaults to weight 400 with normal variant.
import "@fontsource/roboto-condensed/400-italic.css" // Italic variant.
import "@fontsource/roboto-condensed/700.css" // Bold variant.
import "@fontsource/roboto-condensed/700-italic.css" // Bold italic variant.
// import "@fontsource/roboto-condensed/900.css" // Black variant.


const app = createApp(App);

app.use(PrimeVue).use(router).use(JsonViewer).mount('#app');
