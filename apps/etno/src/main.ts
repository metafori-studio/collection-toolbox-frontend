import '@metafori/components/assets/main.css';
import router from '@/router';
import i18n from '@/i18n';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
