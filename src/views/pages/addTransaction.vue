<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Colonne pour les montants envoyés -->
      <div class="md:w-1/2">
        <div class="card flex flex-col gap-4">
          <div class="font-semibold text-xl">Montants Envoyés</div>
          <div class="flex flex-col gap-2">
            <label for="montant_envoye">Montant Envoyé</label>
            <InputText v-model="newTransaction.montant_envoye" id="montant_envoye" type="number" step="0.01" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="numero_compte_envoye">Numéro Compte Envoyé</label>
            <InputText v-model="newTransaction.numero_compte_envoye" id="numero_compte_envoye" type="text" />
          </div>
        </div>
      </div>

      <!-- Colonne pour les montants reçus -->
      <div class="md:w-1/2">
        <div class="card flex flex-col gap-4">
          <div class="font-semibold text-xl">Montants Reçus</div>
          <div class="flex flex-col gap-2">
            <label for="montant_reçu">Montant Reçu</label>
            <InputText v-model="newTransaction.montant_reçu" id="montant_reçu" type="number" step="0.01" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="numero_compte_reçu">Numéro Compte Reçu</label>
            <InputText v-model="newTransaction.numero_compte_reçu" id="numero_compte_reçu" type="text" />
          </div>
        </div>
      </div>
    </div>

    <!-- Section pour la devise et le bouton de soumission -->
    <div class="flex flex-col gap-4 mt-8">
      <div class="card flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-2">
          <label for="devise" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Devise</label>
          <div class="col-span-12 md:col-span-10">
            <select v-model="newTransaction.devise_id" id="devise">
              <option v-for="devise in devises" :key="devise.id" :value="devise.id">
                {{ devise.nom }}
              </option>
            </select>
          </div>
        </div>
        <button @click="submitTransaction">Enregistrer la Transaction</button>
      </div>
    </div>
  </Fluid>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newTransaction: {
        montant_envoye: '',
        numero_compte_envoye: '',
        montant_reçu: '',
        numero_compte_reçu: '',
        devise_id: ''
      },
      devises: []
    };
  },
  mounted() {
    this.fetchDevises();
  },
  methods: {
    fetchDevises() {
      axios.get('/api/devises')
        .then(response => {
          this.devises = response.data;
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des devises", error);
        });
    },
    submitTransaction() {
      axios.post('/api/transactions', this.newTransaction)
        .then(response => {
          alert('Transaction enregistrée avec succès');
          this.resetForm();
        })
        .catch(error => {
          console.error("Erreur lors de l'enregistrement de la transaction", error);
        });
    },
    resetForm() {
      this.newTransaction = {
        montant_envoye: '',
        numero_compte_envoye: '',
        montant_reçu: '',
        numero_compte_reçu: '',
        devise_id: ''
      };
    }
  }
};
</script>

<style scoped>
/* Style personnalisé */
form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
