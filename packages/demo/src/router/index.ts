import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'directive-drag',
            component: () => import('../views/VDragView.vue')
        }
    ]
});

export default router;
