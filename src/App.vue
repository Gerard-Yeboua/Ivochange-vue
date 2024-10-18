<script setup>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
//import { startCase } from 'lodash.startcase';

const router = useRouter();

onMounted(() => {
  // Récupérer le token dans le localStorage
  const token = localStorage.getItem('token');

  // Si le token n'existe pas, rediriger vers la page de connexion
  if (!token) {
    router.push('/auth/login');
  }
});
</script>

<template>
  <!-- Le composant routeur affiche le bon composant selon la route active -->
  <router-view />
</template>

<style scoped>
/* Ajoute des styles ici si nécessaire */
</style>
