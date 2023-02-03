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
const app = createApp(App);

app.use(PrimeVue).use(router).use(JsonViewer).mount('#app');
