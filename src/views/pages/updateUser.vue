<template>
    <div id="page-steppers">
      <div class="card w-full">
        <div class="font-semibold text-xl mb-4">Modifier un Utilisateur</div>
  
        <!-- Champs du formulaire -->
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="nom">Nom</label>
            <InputText id="nom" v-model="utilisateur.nom" type="text" />
          </div>
  
          <div class="flex flex-col gap-2">
            <label for="prenoms">Prénoms</label>
            <InputText id="prenoms" v-model="utilisateur.prenoms" type="text" />
          </div>
  
          <div class="flex flex-col gap-2">
            <label for="telephone">Téléphone</label>
            <InputText id="telephone" v-model="utilisateur.telephone" type="text" />
          </div>
  
          <div class="flex flex-col gap-2">
            <label for="pays">Pays</label>
            <InputText id="pays" v-model="utilisateur.pays" type="text" />
          </div>
  
          <div class="flex flex-col gap-2">
            <label for="email">Email</label>
            <InputText id="email" v-model="utilisateur.email" type="email" />
          </div>
  
          <div class="flex flex-col gap-2">
            <label for="date_inscription">Date d'Inscription</label>
            <InputText id="date_inscription" v-model="utilisateur.date_inscription" type="date" />
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
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        utilisateur: {
          nom: '',
          prenoms: '',
          telephone: '',
          pays: '',
          email: '',
          date_inscription: ''
        },
        userId: null
      };
    },
    methods: {
      resetForm() {
        this.utilisateur = {
          nom: '',
          prenoms: '',
          telephone: '',
          pays: '',
          email: '',
          date_inscription: ''
        };
      },
      async loadUserData() {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/utilisateurs/${this.userId}`);
          const utilisateur = response.data;
  
          // Formater la date d'inscription pour n'inclure que la partie 'yyyy-MM-dd'
          if (utilisateur.date_inscription) {
            utilisateur.date_inscription = utilisateur.date_inscription.split(' ')[0]; // Prendre uniquement la date
          }
  
          this.utilisateur = utilisateur;
        } catch (error) {
          console.error("Erreur lors du chargement des données utilisateur:", error);
        }
      },
      async submitForm() {
        try {
          // Ne pas ajouter d'heures à la date d'inscription
          const response = await axios.put(`http://127.0.0.1:8000/api/utilisateurs/${this.userId}`, this.utilisateur);
          console.log("Utilisateur mis à jour avec succès:", response.data);
          this.$router.push("/auth/listUser/");
          Swal.fire({
            title: 'Succès',
            text: 'Utilisateur mis à jour avec succès!',
            icon: 'success',
            confirmButtonText: 'OK'
            }).then(() => {
            this.$router.push("/auth/listUser");
            });
        } catch (error) {
            console.error("Erreur lors de la soumission du formulaire:", error);

            Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.',
            icon: 'error',
            confirmButtonText: 'OK'
            });
        }
      }
    },
    mounted() {
      this.userId = this.$route.params.id; // Supposons que vous passiez l'userId via les paramètres de la route
      this.loadUserData();
    }
  };
  </script>
  