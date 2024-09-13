<script>
import axios from 'axios';

export default {
    data() {
        return {
            transactions: [],
            devises: [],
            showTransactionForm: false,
            newTransaction: {
                montant_envoye: '',
                numero_compte_envoye: '',
                montant_reçu: '',
                numero_compte_reçu: '',
                devise_id: ''
            }
        };
    },
    mounted() {
        this.fetchTransactions();
        this.fetchDevises();
    },
    methods: {
        fetchTransactions() {
            axios.get('/api/transactions')
                .then(response => {
                    this.transactions = response.data;
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération des transactions", error);
                });
        },
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
                    this.transactions.push(response.data);
                    this.showTransactionForm = false;
                    this.newTransaction = {
                        montant_envoye: '',
                        numero_compte_envoye: '',
                        montant_reçu: '',
                        numero_compte_reçu: '',
                        devise_id: ''
                    };
                })
                .catch(error => {
                    console.error("Erreur lors de l'ajout de la transaction", error);
                });
        }
    }
};
</script>


<template>
    <div>
      <h2>Mes Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Montant Envoyé</th>
            <th>Numéro Compte Envoyé</th>
            <th>Montant Reçu</th>
            <th>Numéro Compte Reçu</th>
            <th>Date</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>{{ transaction.montant_envoye }}</td>
            <td>{{ transaction.numero_compte_envoye }}</td>
            <td>{{ transaction.montant_reçu }}</td>
            <td>{{ transaction.numero_compte_reçu }}</td>
            <td>{{ new Date(transaction.date_transaction).toLocaleString() }}</td>
            <td>{{ transaction.statut }}</td>
          </tr>
        </tbody>
      </table>

      <button @click="showTransactionForm = true">Effectuer une Transaction</button>

      <!-- Formulaire de transaction -->
      <div v-if="showTransactionForm">
        <h3>Nouvelle Transaction</h3>
        <form @submit.prevent="submitTransaction">
          <input v-model="newTransaction.montant_envoye" placeholder="Montant Envoyé" type="number" />
          <input v-model="newTransaction.numero_compte_envoye" placeholder="Numéro Compte Envoyé" type="text" />
          <input v-model="newTransaction.montant_reçu" placeholder="Montant Reçu" type="number" />
          <input v-model="newTransaction.numero_compte_reçu" placeholder="Numéro Compte Reçu" type="text" />
          <select v-model="newTransaction.devise_id">
            <option v-for="devise in devises" :key="devise.id" :value="devise.id">
              {{ devise.nom }}
            </option>
          </select>
          <button type="submit">Envoyer</button>
        </form>
      </div>
    </div>
  </template>


  <style scoped>
  /* Ajoutez du style ici si nécessaire */
  </style>
