<template>
    <div id="page-steppers">
        <Fluid>
            <div class="card w-full">
                <div class="font-semibold text-xl mb-4">Créer un Utilisateur</div>

                <!-- Champs du formulaire -->
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label for="nom">Nom</label>
                        <InputText id="nom" v-model="utilisateurs.nom" type="text" required />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="prenoms">Prénoms</label>
                        <InputText id="prenoms" v-model="utilisateurs.prenoms" type="text" required />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="telephone">Téléphone</label>
                        <InputText id="telephone" v-model="utilisateurs.telephone" type="text" required />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="pays">Pays</label>
                        <InputText id="pays" v-model="utilisateurs.pays" type="text" required />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="email">Email</label>
                        <InputText id="email" v-model="utilisateurs.email" type="email" required />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="mot_de_passe">Mot de Passe</label>
                        <InputText id="mot_de_passe" v-model="utilisateurs.mot_de_passe" type="password" required />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="date_inscription">Date d'Inscription</label>
                        <InputText id="date_inscription" v-model="utilisateurs.date_inscription" type="date" required />
                    </div>
                </div>
            </div>

            <!-- Boutons Enregistrer et Annuler -->
            <div class="flex justify-end mt-8">
                <div class="card w-full flex justify-end gap-2">
                    <Button label="Annuler" @click="resetForm" class="p-button-secondary" />
                    <Button label="Enregistrer" @click="submitForm" class="p-button-primary ml-2" />
                </div>
            </div>
        </Fluid>
    </div>
</template>

<script>
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Fluid from 'primevue/fluid';

export default {
    data() {
        return {
            utilisateurs: {
                nom: '',
                prenoms: '',
                telephone: '',
                pays: '',
                email: '',
                mot_de_passe: '',
                date_inscription: '',
                statut: null
            }
        };
    },
    methods: {
        resetForm() {
            this.utilisateurs = {
                nom: '',
                prenoms: '',
                telephone: '',
                pays: '',
                email: '',
                mot_de_passe: '',
                date_inscription: '',
                statut: null
            };
        },
        submitForm(event) {
            event.preventDefault();
            // Validation des champs
            const { nom, prenoms, email, mot_de_passe, telephone } = this.utilisateurs;
            if (nom && prenoms && email && mot_de_passe && telephone) {
                axios.post('http://127.0.0.1:8000/api/create', this.utilisateurs)
                    .then((response) => {
                        console.log('Utilisateur créé avec succès:', response.data);
                        this.$router.push("/auth/login");
                        this.resetForm();
                    })
                    .catch((error) => {
                        if (error.response) {
                            console.error('Erreur lors de la création de l\'utilisateur:', error.response.data);
                        } else if (error.request) {
                            console.error('Aucune réponse reçue du serveur:', error.request);
                        } else {
                            console.error('Erreur lors de la configuration de la requête:', error.message);
                        }
                    });
            } else {
                console.error('Veuillez remplir tous les champs obligatoires.');
            }
        }
    },
    components: {
        InputText,
        Button,
        Fluid
    }
};
</script>

<style scoped>
.card {
    padding: 1.5rem;
    border-radius: 0.5rem;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
