<template>
    <div>
      <h1>Gestion des Utilisateurs</h1>
      <Toolbar class="mb-6">
        <template #start>
          <router-link to="/pages/addUser">
            <Button icon="pi pi-plus" class="mr-2" @click="openNew" label="Nouveau"/>
          </router-link>
          <Button label="Supprimer" icon="pi pi-trash" :disabled="!selectedUtilisateurs.length" @click="confirmDeleteSelected" />
        </template>
      </Toolbar>
  
      <DataTable v-model:selection="selectedUtilisateurs" :value="utilisateurs" dataKey="id" :paginator="true" :rows="10">
        <template #header>
          <div class="table-header">
            <h4>Liste des Utilisateurs</h4>
            <InputText v-model="filters.global" placeholder="Rechercher..." />
          </div>
        </template>
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="id" header="ID" sortable></Column>
        <Column field="nom" header="Nom" sortable></Column>
        <Column field="prenom" header="Prénoms" sortable></Column>
        <Column field="telephone" header="Téléphone" sortable></Column>
        <Column field="pays" header="Pays" sortable></Column>
        <Column field="date_inscription" header="Date d'inscription" sortable></Column>
        <Column header="Actions" :exportable="false">
          <template #body="slotProps">
            <router-link :to="{ name: 'updateUser', params: { id: slotProps.data.id }}">
              <Button icon="pi pi-pencil" />
            </router-link>
            <Button icon="pi pi-trash" class="ml-2" severity="danger" @click="confirmDeleteUtilisateur(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
  
      <Dialog v-model:visible="utilisateurDialog" header="Détails de l'utilisateur" modal>
        <div>
          <label for="nom">Nom</label>
          <InputText id="nom" v-model="utilisateur.nom" required autofocus />
          <label for="prenom">Prénoms</label>
          <InputText id="prenom" v-model="utilisateur.prenom" required />
          <!-- Ajoutez plus de champs selon vos besoins -->
        </div>
        <template #footer>
          <Button label="Annuler" @click="hideDialog" />
          <Button label="Enregistrer" @click="saveUtilisateur" />
        </template>
      </Dialog>
  
      <Dialog v-model:visible="deleteUtilisateurDialog" header="Confirmer la suppression" modal>
        <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
        <template #footer>
          <Button label="Non" @click="deleteUtilisateurDialog = false" />
          <Button label="Oui" @click="deleteUtilisateur" />
        </template>
      </Dialog>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useToast } from 'primevue/usetoast';
  
  export default {
    setup() {
      const utilisateurs = ref([]);
      const selectedUtilisateurs = ref([]);
      const utilisateurDialog = ref(false);
      const deleteUtilisateurDialog = ref(false);
      const utilisateur = ref({});
      const toast = useToast();
      
      // Initialisation des filtres avec un objet 'global'
      const filters = ref({
        global: ''
      });
  
      const fetchUtilisateurs = () => {
        axios
          .get('http://127.0.0.1:8000/api/liste')
          .then((response) => {
            utilisateurs.value = response.data.utilisateurs;
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
          });
      };
  
      const openNew = () => {
        utilisateur.value = {};
        utilisateurDialog.value = true;
      };
  
      const hideDialog = () => {
        utilisateurDialog.value = false;
      };
  
      const saveUtilisateur = () => {
        if (utilisateur.value.id) {
          // Mise à jour d'un utilisateur
          axios.put(`http://127.0.0.1:8000/api/utilisateurs/${utilisateur.value.id}`, utilisateur.value)
            .then(() => {
              const index = utilisateurs.value.findIndex((u) => u.id === utilisateur.value.id);
              utilisateurs.value[index] = { ...utilisateur.value };
              toast.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur mis à jour', life: 3000 });
              utilisateurDialog.value = false;
            })
            .catch((error) => {
              console.error('Erreur lors de la mise à jour de l’utilisateur :', error);
            });
        } else {
          // Création d'un nouvel utilisateur
          axios.post('http://127.0.0.1:8000/api/utilisateurs', utilisateur.value)
            .then((response) => {
              utilisateurs.value.push(response.data.utilisateur);
              toast.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur créé', life: 3000 });
              utilisateurDialog.value = false;
            })
            .catch((error) => {
              console.error('Erreur lors de la création de l’utilisateur :', error);
            });
        }
      };
  
      const editUtilisateur = (utilisateurToEdit) => {
        utilisateur.value = { ...utilisateurToEdit };
        utilisateurDialog.value = true;
      };
  
      const confirmDeleteUtilisateur = (utilisateurToDelete) => {
        utilisateur.value = utilisateurToDelete;
        deleteUtilisateurDialog.value = true;
      };
  
      const deleteUtilisateur = () => {
        axios.delete(`http://127.0.0.1:8000/api/utilisateurs/${utilisateur.value.id}`)
          .then(() => {
            utilisateurs.value = utilisateurs.value.filter((u) => u.id !== utilisateur.value.id);
            deleteUtilisateurDialog.value = false;
            utilisateur.value = {};
            toast.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur supprimé', life: 3000 });
          })
          .catch((error) => {
            console.error('Erreur lors de la suppression de l’utilisateur :', error);
          });
      };
  
      const confirmDeleteSelected = () => {
        // Logique pour confirmer la suppression des utilisateurs sélectionnés
      };
  
      onMounted(fetchUtilisateurs);
  
      return {
        utilisateurs,
        selectedUtilisateurs,
        utilisateur,
        utilisateurDialog,
        deleteUtilisateurDialog,
        openNew,
        hideDialog,
        saveUtilisateur,
        editUtilisateur,
        confirmDeleteUtilisateur,
        deleteUtilisateur,
        confirmDeleteSelected,
        filters,
      };
    },
  };
  </script>
  
  <style scoped>
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  </style>