import { createRouter, createWebHistory, RouteRecordRaw, RouterScrollBehavior } from 'vue-router';

// import Upload from '../components/Upload.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    // component: Home,
    component: () => import('./components/Home.vue'),
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import('./components/Stats.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('./components/About.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
