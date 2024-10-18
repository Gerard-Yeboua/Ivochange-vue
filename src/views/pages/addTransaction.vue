<script>
import axios from 'axios';

export default {
    data() {
        return {
            newTransaction: {
                montant_envoye: '',
                numero_compte_envoye: '',
                montant_recu: '',
                numero_compte_recu: '',
                devise_envoyee_id: '',
                devise_recue_id: '',
                montant_frais_inclus_envoye: '',
                montant_frais_inclus_recu: ''
            },
            utilisateurs: {
                nom: '',
                prenoms: '',
                telephone: '',
                email: '',
                pays: ''
            },
            devises: {}
        };
    },
    mounted() {
        this.fetchDevises();
    },
    methods: {
        fetchDevises() {
            axios.get('http://127.0.0.1:8000/api/devises')
                .then((response) => {
                    // Vérifier si response.data est un tableau avant d'utiliser concat
                    if (Array.isArray(response.data)) {
                        this.devises = response.data.concat([
                            { id: 1, nom: 'Orange Money' },
                            { id: 2, nom: 'MTN Money' },
                            { id: 3, nom: 'Moov Money' },
                            { id: 4, nom: 'Wave' },
                            { id: 5, nom: 'MoneyGram' },
                            { id: 6, nom: 'Western Union' }
                        ]);
                    } else {
                        // Si ce n'est pas un tableau, initialiser `devises` avec les éléments locaux
                        this.devises = [
                            { id: 1, nom: 'Orange Money' },
                            { id: 2, nom: 'MTN Money' },
                            { id: 3, nom: 'Moov Money' },
                            { id: 4, nom: 'Wave' },
                            { id: 5, nom: 'MoneyGram' },
                            { id: 6, nom: 'Western Union' }
                        ];
                        console.error('Les données de l\'API ne sont pas un tableau.', response.data);
                    }
                })
                .catch((error) => {
                    console.error('Erreur lors de la récupération des devises', error);
                });
        },

        submitTransaction() {
            // Validation basique
            if (!this.newTransaction.montant_envoye || !this.newTransaction.numero_compte_envoye || !this.newTransaction.devise_envoyee_id) {
                alert('Veuillez remplir tous les champs requis.');
                return;
            }

            // Combiner les données utilisateur et transaction
            const data = {
                transactions: this.newTransaction,
                utilisateurs: this.utilisateurs
            };

            axios.post('http://127.0.0.1:8000/api/create', data)
                .then(() => {
                    alert('Transaction enregistrée avec succès');
                    this.resetForm();
                })
                .catch((error) => {
                    console.error("Erreur lors de l'enregistrement de la transaction", error);
                });
        },
        resetForm() {
            this.newTransaction = {
                montant_envoye: '',
                numero_compte_envoye: '',
                montant_recu: '',
                numero_compte_recu: '',
                devise_envoyee_id: '',
                devise_recue_id: '',
                montant_frais_inclus_envoye: '',
                montant_frais_inclus_recu: ''
            };
            this.utilisateurs = {
                nom: '',
                prenoms: '',
                telephone: '',
                email: '',
                pays: ''
            };
        }
    }
};
</script>

<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Colonne pour les montants envoyés -->
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">J'envoie de l'argent</div>
                    <div class="flex flex-col gap-2">
                        <label for="devise_envoyee">Devise Envoyée</label>
                        <select v-model="newTransaction.devise_envoyee_id" id="devise_envoyee">
                            <option v-for="devise in devises" :key="devise.id" :value="devise.id">{{ devise.nom }}
                            </option>
                        </select>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="montant_envoye">Montant Envoyé</label>
                        <InputText v-model="newTransaction.montant_envoye" id="montant_envoye" type="number"
                            step="0.01" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="numero_compte_envoye">Numéro Compte Envoyé</label>
                        <InputText v-model="newTransaction.numero_compte_envoye" id="numero_compte_envoye"
                            type="text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="montant_frais_inclus_envoye">Montant avec frais inclus (Envoyé)</label>
                        <InputText v-model="newTransaction.montant_frais_inclus_envoye" id="montant_frais_inclus_envoye"
                            type="number" step="0.01" />
                    </div>
                    <hr />
                    <div class="font-semibold text-xl">Je reçois de l'argent</div>
                    <div class="flex flex-col gap-2">
                        <label for="devise_recue">Devise Reçue</label>
                        <select v-model="newTransaction.devise_recue_id" id="devise_recue">
                            <option v-for="devise in devises" :key="devise.id" :value="devise.id">{{ devise.nom }}
                            </option>
                        </select>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="montant_recu">Montant Reçu</label>
                        <InputText v-model="newTransaction.montant_recu" id="montant_recu" type="number" step="0.01" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="numero_compte_recu">Numéro Compte Reçu</label>
                        <InputText v-model="newTransaction.numero_compte_recu" id="numero_compte_recu" type="text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="montant_frais_inclus_recu">Montant avec frais inclus (Reçu)</label>
                        <InputText v-model="newTransaction.montant_frais_inclus_recu" id="montant_frais_inclus_recu"
                            type="number" step="0.01" />
                    </div>
                </div>
            </div>

            <!-- Colonne pour les informations personnelles -->
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Informations Personnelles</div>
                    <div class="flex flex-col gap-2">
                        <label for="nom">Nom</label>
                        <InputText v-model="utilisateurs.nom" id="nom" type="text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="prenoms">Prénoms</label>
                        <InputText v-model="utilisateurs.prenoms" id="prenoms" type="text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="telephone">Téléphone</label>
                        <InputText v-model="utilisateurs.telephone" id="telephone" type="number" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="email">Adresse Email</label>
                        <InputText v-model="utilisateurs.email" id="email" type="email" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="pays">Pays de Résidence</label>
                        <InputText v-model="utilisateurs.pays" id="pays" type="text" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Bouton de soumission -->
        <div class="flex flex-col gap-4 mt-8">
            <div class="card flex flex-col gap-4">
                <button @click="submitTransaction">Enregistrer la Transaction</button>
            </div>
        </div>
    </Fluid>
</template>

<style scoped>
/* Style personnalisé */
form div {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input,
select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
}

button {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}
</style>
