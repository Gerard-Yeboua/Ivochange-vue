<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Variables pour les données du formulaire
const nom = ref('');
const symbole = ref('');
const reserve = ref('');
const errors = ref({});

// Fonction pour valider le formulaire
const validateForm = () => {
    errors.value = {}; // Réinitialiser les erreurs

    // Validation des champs
    if (!nom.value) {
        errors.value.nom = 'Le nom est requis.';
    }
    if (!symbole.value) {
        errors.value.symbole = 'Le symbole est requis.';
    }
    if (!reserve.value || isNaN(reserve.value)) {
        errors.value.reserve = 'La réserve doit être un nombre.';
    }

    // Retourne vrai si aucune erreur n'est trouvée
    return Object.keys(errors.value).length === 0;
};

// Fonction pour soumettre le formulaire
const submitForm = async () => {
    // Valider le formulaire avant de soumettre
    if (!validateForm()) return;

    try {
        // Récupérer le token d'authentification stocké
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Vous devez être connecté pour soumettre le formulaire.");
            return;
        }

        // Envoi de la requête POST avec les données du formulaire
        const response = await axios.post('http://127.0.0.1:8000/api/devises', {
            nom: nom.value,
            symbole: symbole.value,
            reserve: reserve.value
        }, {
            headers: {
                'Authorization': `Bearer ${token}` // Ajout du token d'authentification dans l'en-tête
            }
        });

        alert('Devise enregistrée avec succès');

        // Réinitialiser le formulaire après succès
        nom.value = '';
        symbole.value = '';
        reserve.value = '';

    } catch (error) {
        // Gestion d'erreur
        if (error.response && error.response.status === 401) {
            alert('Vous n\'êtes pas autorisé à effectuer cette action. Veuillez vous authentifier.');
        } else if (error.response && error.response.data) {
            // Afficher les erreurs de validation du backend
            errors.value = error.response.data.errors || {};
        } else {
            alert('Erreur lors de l\'enregistrement de la devise.');
        }
    }
};
</script>

<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8 justify-center items-center min-h-screen">
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Enregistrer une devise</div>
                    <div class="flex flex-col gap-2">
                        <label for="nom">Nom</label>
                        <InputText v-model="nom" id="nom" type="text" />
                        <span v-if="errors.nom" class="text-red-500">{{ errors.nom }}</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="symbole">Symbole</label>
                        <InputText v-model="symbole" id="symbole" type="text" />
                        <span v-if="errors.symbole" class="text-red-500">{{ errors.symbole }}</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="reserve">Reserve</label>
                        <InputText v-model="reserve" id="reserve" type="text" />
                        <span v-if="errors.reserve" class="text-red-500">{{ errors.reserve }}</span>
                    </div>
                    <button @click="submitForm" class="btn btn-primary">Enregistrer</button>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<style scoped>
button {
    padding: 10px 20px;
    background-color: #37e33d;
    color: white;
    border: none;
    cursor: pointer;
}

.min-h-screen {
    min-height: 100vh;
}

.flex {
    display: flex;
}

.justify-center {
    justify-content: center;
}

.items-center {
    align-items: center;
}

.text-red-500 {
    color: red;
}
</style>
