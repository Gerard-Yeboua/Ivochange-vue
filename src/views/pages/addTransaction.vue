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
                devise_id: '',
                montant_frais_inclus_envoye: '',
                montant_frais_inclus_reçu: ''
            },  
            utilisateurs: {
                nom: '',
                prenoms: '',
                telephone: '',
                email: '',
                pays: ''
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
        // Méthode pour calculer le montant envoyé avec les frais
        calculateMontantAvecFrais() {
            if (this.newTransaction.montant_envoye) {
                // Calcul de 1% des frais sur le montant
                let frais = (this.newTransaction.montant_envoye * 0.01);
                this.newTransaction.montant_frais_inclus_envoye = (parseFloat(this.newTransaction.montant_envoye) + frais).toFixed(2);
                
                // Calcul du montant reçu après frais (montant envoyé moins les frais)
                this.newTransaction.montant_frais_inclus_reçu = (parseFloat(this.newTransaction.montant_envoye) - frais).toFixed(2);

                // Mettre à jour le montant reçu avec les frais (montant envoyé moins les frais)
                this.newTransaction.montant_reçu = this.newTransaction.montant_frais_inclus_reçu;
            } else {
                this.newTransaction.montant_frais_inclus_envoye = '';
                this.newTransaction.montant_frais_inclus_reçu = '';
                this.newTransaction.montant_reçu = '';
            }
        },
        submitTransaction() {
            axios.post('/api/create', this.newTransaction)
                .then((response) => {
                    alert('Transaction enregistrée avec succès');
                    this.resetForm();
                })
                .catch(error => {
                    console.error("Erreur lors de l'enregistrement de la transaction", error);
                });
        },
        limitPhoneNumber(event) {
            const phoneNumber = event.target.value.replace(/\D/g, ''); // Filtrer les non-chiffres
            if (phoneNumber.length > 10) {
                this.utilisateurs.telephone = phoneNumber.slice(0, 10); // Limiter à 10 chiffres
            } else {
                this.utilisateurs.telephone = phoneNumber;
            }
        },
        validateEmail() {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRegex.test(this.utilisateurs.email)) {
                this.errors.email = "L'email doit contenir un '@' et être valide.";
            } else {
                this.errors.email = null;
            }
        },
        resetForm() {
            this.newTransaction = {
                montant_envoye: '',
                numero_compte_envoye: '',
                montant_reçu: '',
                numero_compte_reçu: '',
                devise_id: '',
                montant_frais_inclus_envoye: '',
                montant_frais_inclus_reçu: ''
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
                    <div class="card flex flex-col gap-4">
                        <div class="grid grid-cols-12 gap-2">
                            <label for="devise" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Compte
                                envoyé</label>
                            <div class="col-span-12 md:col-span-10">
                                <select v-model="newTransaction.devise_id" id="devise">
                                    <option value="devise.id">Orange Money</option>
                                    <option value="devise.id">MTN Money</option>
                                    <option value="devise.id">Moov Money</option>
                                    <option value="devise.id">Wave</option>
                                    <option value="devise.id">Perfect Money</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="montant_envoye">Montant Envoyé</label>
                        <InputText v-model="newTransaction.montant_envoye" id="montant_envoye" type="number"
                            step="0.01" @input="calculateMontantAvecFrais" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="numero_compte_envoye">Numéro Compte Envoyé</label>
                        <InputText v-model="newTransaction.numero_compte_envoye" id="numero_compte_envoye"
                            type="text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="montant_frais_inclus_envoye">Montant avec frais inclus</label>
                        <InputText v-model="newTransaction.montant_frais_inclus_envoye" id="montant_frais_inclus_envoye"
                            type="number" step="0.01" disabled />
                    </div>
                    <hr />
                    <!-- Je la partie où je reçois de l'argent-->
                    <div class="font-semibold text-xl">Je reçois de l'argent</div>
                    <div class="card flex flex-col gap-4">
                        <div class="grid grid-cols-12 gap-2">
                            <label for="devise" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Compte reçu
                                </label>
                            <div class="col-span-12 md:col-span-10">
                                <select v-model="newTransaction.devise_id" id="devise">
                                    <option value="devise.id">Orange Money</option>
                                    <option value="devise.id">MTN Money</option>
                                    <option value="devise.id">Moov Money</option>
                                    <option value="devise.id">Wave</option>
                                    <option value="devise.id">Perfect Money</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="montant_reçu">Montant reçu</label>
                        <InputText v-model="newTransaction.montant_reçu" id="montant_reçu" type="number" step="0.01" disabled />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="numero_compte_reçu">Numéro de reception</label>
                        <InputText v-model="newTransaction.numero_compte_reçu" id="numero_compte_reçu" type="text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="montant_frais_inclus_reçu">Montant reçu après frais</label>
                        <InputText v-model="newTransaction.montant_frais_inclus_reçu" id="montant_frais_inclus_reçu"
                            type="number" step="0.01" disabled />
                    </div>
                </div>
            </div>

            <!-- Colonne pour les informations personnelles -->
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Information personnelles</div>
                    <div class="flex flex-col gap-2">
                        <label for="nom">Nom</label>
                        <InputText v-model="utilisateurs.nom" id="nom" type="text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="prenoms">Prénoms</label>
                        <InputText v-model="utilisateurs.prenoms" id="prenoms" type="text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <InputText 
                            id="telephone" 
                            label="Téléphone" 
                            :value="utilisateurs.telephone"
                            @input="limitPhoneNumber"
                        />
                    </div>
                    <div class="flex flex-col gap-2">
                        <InputText v-model="utilisateurs.email" id="email" type="email" @blur="validateEmail" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="pays">Pays</label>
                        <InputText v-model="utilisateurs.pays" id="pays" type="text" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>
