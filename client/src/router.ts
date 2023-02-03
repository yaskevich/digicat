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
    path: '/about',
    name: 'About',
    component: () => import('./components/About.vue'),
  },
];

const scrollBehavior: RouterScrollBehavior = async (to: any, from: any, savedPosition: any) => {
  console.log('savedPosition', savedPosition);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (savedPosition) {
        console.log('restore scroll position');
        resolve(savedPosition);
      } else {
        resolve({ top: 0 });
      }
    }, 1500);
  });
};

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior,
});

export default router;
