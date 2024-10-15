import axios from 'axios';

// Créer une instance axios
const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Remplace par l'URL de ton backend
  timeout: 10000, // Temps d'attente
});

// Intercepteur pour ajouter le token à chaque requête si disponible
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Récupérer le token stocké
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Ajouter le token à l'en-tête
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gérer les erreurs de réponse
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gérer les erreurs 401, etc.
    if (error.response.status === 401) {
      console.error('Non autorisé, redirection vers la page de login...');
      // Tu peux rediriger l'utilisateur ici vers la page de login
    }
    return Promise.reject(error);
  }
);

export default instance;
