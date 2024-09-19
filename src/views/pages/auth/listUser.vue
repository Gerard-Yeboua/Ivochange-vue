<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <router-link to="/pages/addUser">
            <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" />
          </router-link>
        </template>

        <template #end>
          <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
        </template>
      </Toolbar>

      <div class="font-semibold text-xl mb-4">Liste des Utilisateurs</div>
      <DataTable :value="utilisateurs" scrollable scrollHeight="400px" paginator :rows="10" 
                 :first="first" :total-records="utilisateurs.length" @page="onPage" class="mt-6">
        <Column field="id" header="ID" style="min-width: 100px"></Column>
        <Column field="nom" header="Nom" style="min-width: 200px"></Column>
        <Column field="prenoms" header="Prénoms" style="min-width: 200px"></Column>
        <Column field="telephone" header="Téléphone" style="min-width: 200px"></Column>
        <Column field="pays" header="Pays" style="min-width: 200px"></Column>
        <Column field="date_inscription" header="Date d'inscription" :body="formatDateInscription" style="min-width: 200px"></Column>
        <Column header="Actions" style="min-width: 200px">
          <template #body="slotProps">
            <router-link :to="`/pages/updateUser/${slotProps.data.id}`">
              <Button label="Modifier" icon="pi pi-pencil" outlined rounded class="mr-2" small title="Modifier les infos de l'utilisateur" />
            </router-link>
            <Button label="Supprimer" icon="pi pi-trash" outlined rounded severity="danger" small @click="confirmDeleteUser(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
      <p v-if="!utilisateurs.length">Aucun utilisateur trouvé.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Swal from 'sweetalert2';

export default {
  components: {
    DataTable,
    Column,
    Button,
  },
  setup() {
    const utilisateurs = ref([]);
    const first = ref(0);  // Ajout de la gestion de la pagination

    const fetchUtilisateurs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/liste');
        utilisateurs.value = response.data.utilisateurs;
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    };

    const confirmDeleteUser = (user) => {
      Swal.fire({
        title: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.nom} ?`,
        text: "Cette action est irréversible !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer !',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`http://127.0.0.1:8000/api/utilisateurs/${user.id}`)
            .then(() => {
              Swal.fire(
                'Supprimé !',
                "L'utilisateur a été supprimé.",
                'success'
              );
              fetchUtilisateurs(); // Rafraîchir la liste après la suppression
            })
            .catch((error) => {
              console.error("Erreur lors de la suppression de l'utilisateur :", error);
              Swal.fire(
                'Erreur !',
                "Une erreur s'est produite lors de la suppression de l'utilisateur.",
                'error'
              );
            });
        }
      });
    };

    // Fonction de formatage de la date sans l'heure
    const formatDateInscription = (utilisateur) => {
      if (!utilisateur.date_inscription) return ''; // Gérer les cas où la date n'existe pas
      const dateOnly = utilisateur.date_inscription.split(' ')[0]; // Extraire uniquement la partie de la date (avant l'heure)
      const date = new Date(dateOnly);
      // Format de la date en jour/mois/année
      return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    };

    const onPage = (event) => {
      first.value = event.first; // Gérer la pagination
    };

    const exportCSV = (event) => {
      // Logique pour exporter les utilisateurs en CSV
    };

    onMounted(() => {
      fetchUtilisateurs();
    });

    return {
      utilisateurs,
      first,
      confirmDeleteUser,
      formatDateInscription,
      onPage,
      exportCSV,
    };
  },
};
</script>

<style scoped lang="scss">
.card {
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.font-semibold {
  font-weight: 600;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  font-weight: normal;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  font-weight: bold;
}
</style>
