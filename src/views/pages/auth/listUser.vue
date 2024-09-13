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
        <DataTable :value="utilisateurs" scrollable scrollHeight="400px" class="mt-6">
          <Column field="id" header="ID" style="min-width: 100px"></Column>
          <Column field="nom" header="Nom" style="min-width: 200px"></Column>
          <Column field="prenoms" header="Prénoms" style="min-width: 200px"></Column>
          <Column field="telephone" header="Téléphone" style="min-width: 200px"></Column>
          <Column field="pays" header="Pays" style="min-width: 200px"></Column>
          <Column field="date_inscription" header="Date d'inscription" style="min-width: 200px"><template #body="slotProps">
            <router-link :to="`/pages/modifieUser${slotProps.data.id}`">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" small title="Modifier les infos de l'utilisateur" />
            </router-link>
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUser(slotProps.data)" />
            </template>
            </Column>
          <Column :exportable="false" style="min-width: 12rem"></Column>

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

export default {
  components: {
    DataTable,
    Column,
    Button,
  },
  setup() {
    const utilisateurs = ref([]);
    const selectedProducts = ref([]);

    const fetchUtilisateurs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/liste');
        utilisateurs.value = response.data.utilisateurs;
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    };

    const confirmDeleteUser = (user) => {
      if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.nom} ?`)) {
        axios.delete(`http://127.0.0.1:8000/api/utilisateurs/${user.id}`)
          .then(() => {
            fetchUtilisateurs(); // Rafraîchir la liste après la suppression
          })
          .catch((error) => {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
          });
      }
    };

    const openNew = () => {
      // Logique pour ouvrir le formulaire de création
    };

    const confirmDeleteSelected = () => {
      // Logique pour supprimer les utilisateurs sélectionnés
    };

    const exportCSV = (event) => {
      // Logique pour exporter les utilisateurs en CSV
    };

    onMounted(() => {
      fetchUtilisateurs();
    });

    return {
      utilisateurs,
      selectedProducts,
      confirmDeleteUser,
      openNew,
      confirmDeleteSelected,
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

.table-container {
  overflow-x: auto;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  font-weight: normal;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  font-weight: bold;
}
</style>
