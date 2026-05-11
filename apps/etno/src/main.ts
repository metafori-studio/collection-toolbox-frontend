import '@metafori/components/assets/main.css';
import router from '@/router';
import i18n from '@/i18n';
import { setupGtm, setupMatomo } from '@metafori/shared';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use(router);
const gtm = setupGtm(router);
if (gtm) {
  app.use(gtm);
}
setupMatomo();
app.use(i18n);
app.mount('#app');
