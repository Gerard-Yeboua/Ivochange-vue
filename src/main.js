import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

// Utilisation d'importation ES6
import 'waypoints/lib/noframework.waypoints.min';

// Configuration d'axios pour gérer les erreurs
import axios from 'axios';
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 500) {
      router.push({ path: '/auth/error' });
    } else if (error.response && error.response.status === 404) {
      router.push('/pages/notfound');
    } else if (error.response && error.response.status === 422) {
      // Gérer l'erreur personnalisée ici
    } else if (error.response && error.response.status === 401) {
      if (error.response.data.isDisconnected) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push({ path: '/auth/login' });
      }
    }
    return Promise.reject(error);
  }
);

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
