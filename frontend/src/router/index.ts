import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';

const routes = [
  { path: '/', component: Home },
  // 添加其他路由
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
