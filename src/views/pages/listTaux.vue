<template>
    <div class="card">
      <div class="font-semibold text-xl mb-4">Liste des Taux d'Échange</div>
      
      <ToggleButton v-model="balanceFrozen" onIcon="pi pi-lock" offIcon="pi pi-lock-open" onLabel="Taux" offLabel="Taux" />
  
      <!-- Si la liste est vide, afficher un message -->
      <div v-if="tauxEchanges.length === 0" class="empty-message">
        <p>Aucun taux d'échange disponible pour le moment.</p>
      </div>
  
      <!-- Sinon, afficher le tableau -->
      <div v-else>
        <DataTable :value="tauxEchanges" scrollable scrollHeight="400px" class="mt-6">
          <Column field="devise.nom" header="Devise" style="min-width: 200px" frozen class="font-bold"></Column>
          <Column field="taux" header="Taux" style="min-width: 200px"></Column>
          <Column field="date_taux" header="Date" style="min-width: 200px"></Column>
        </DataTable>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        tauxEchanges: [],
        balanceFrozen: false, // Contrôle l'état du gel de la colonne
      };
    },
    mounted() {
      this.fetchTauxEchanges();
    },
    methods: {
      fetchTauxEchanges() {
        axios.get('/api/taux-echanges')
          .then(response => {
            this.tauxEchanges = response.data;
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des taux d'échange", error);
          });
      },
      formatCurrency(value) {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
        }).format(value);
      }
    }
  };
  </script>
  
  <style scoped>
  /* Style personnalisé */
  .card {
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .font-bold {
    font-weight: bold;
  }
  
  .mt-6 {
    margin-top: 1.5rem;
  }
  
  .empty-message {
    text-align: center;
    font-size: 1.2rem;
    color: #888;
  }
  </style>
  