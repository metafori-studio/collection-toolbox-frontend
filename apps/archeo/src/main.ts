import '@metafori/components/assets/main.css';
import { createApp } from 'vue';
import router from '@/router';
import { setupGtm, setupMatomo } from '@metafori/shared';
import App from './App.vue';

const app = createApp(App);

app.use(router);
const gtm = setupGtm(router);
if (gtm) {
  app.use(gtm);
}
setupMatomo();
app.mount('#app');
