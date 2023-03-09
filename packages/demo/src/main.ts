import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import './assets/main.css';

import { LvDrag, LvDragItem } from 'liuyc-vue/src/directives';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.directive('lvDrag', LvDrag);
app.directive('lvDragItem', LvDragItem);

app.mount('#app');
