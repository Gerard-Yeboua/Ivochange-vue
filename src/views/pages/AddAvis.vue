<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Variables pour les données du formulaire
const note = ref('');
const commentaire = ref('');
const errors = ref({});

// Fonction pour valider le formulaire
const validateForm = () => {
    errors.value = {}; // Réinitialiser les erreurs

    // Validation des champs
    if (!note.value) {
        errors.value.note = 'Le note est requis.';
    }
    if (!commentaire.value) {
        errors.value.commentaire = 'Le commentaire est requis.';
    }
    // Retourne vrai si aucune erreur n'est trouvée
    if (note.value < 1 || note.value > 5) {
        errors.value.note = 'La note doit être entre 1 et 5.';
    }
    if (commentaire.value.length > 255) {
        errors.value.commentaire = 'Le commentaire ne doit pas dépasser 255 caractères.';
    }
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
        const response = await axios.post('http://127.0.0.1:8000/api/avis', {
            note: note.value,
            commentaire: commentaire.value,
        }, {
            headers: {
                'Authorization': `Bearer ${token}` // Ajout du token d'authentification dans l'en-tête
            }
        });

        alert('Avis envoyé avec succès');

        // Réinitialiser le formulaire après succès
        note.value = '';
        commentaire.value = '';

    } catch (error) {
        // Gestion d'erreur
        if (error.response && error.response.status === 401) {
            alert('Vous n\'êtes pas autorisé à effectuer cette action. Veuillez vous authentifier.');
        } else if (error.response && error.response.data) {
            // Afficher les erreurs de validation du backend
            errors.value = error.response.data.errors || {};
        } else {
            alert('Erreur lors de l\'enregistrement de l\'actualité.');
        }
    }
};
</script>

<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8 justify-center items-center min-h-screen">
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">Enregistrer ton avis</div>
                    <div class="flex flex-col gap-2">
                        <label for="nom">Note de votre avis </label>
                        <InputText v-model="note" id="note" type="text" />
                        <span v-if="errors.note" class="text-red-500">{{ errors.note }}</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="commentaire">Votre commentaire</label>
                        <InputText v-model="commentaire" id="commentaire" type="text" />
                        <span v-if="errors.commentaire" class="text-red-500">{{ errors.commentaire }}</span>
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
