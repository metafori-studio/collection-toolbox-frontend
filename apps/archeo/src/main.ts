import '@metafori/components/assets/main.css';
import { createApp } from 'vue';
import router from '@/router';
import i18n from '@/i18n';
import { setupGtm, setupMatomo } from '@metafori/shared';
import App from './App.vue';

const app = createApp(App);

app.use(router);
app.use(i18n);
const gtm = setupGtm(router);
if (gtm) {
  app.use(gtm);
}
setupMatomo();
app.mount('#app');
