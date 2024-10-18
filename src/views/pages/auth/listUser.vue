<script>
import Vue from 'vue';
import { ref, onMounted } from 'vue';
import anyname from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
//import { startCase } from 'lodash.startcase'; // Corriger l'importation ici

export default {
    components: {
        DataTable,
        Column,
        Button
    },
    setup() {
        const utilisateurs = ref([]);
        const first = ref(0);
        const totalRecords = ref(0);

        // Récupérer tous les utilisateurs depuis l'API
        const fetchUtilisateurs = async () => {
            try {
                const token = localStorage.getItem('token'); // Supposons que le jeton soit stocké dans le localStorage
                const response = await axios.get('http://127.0.0.1:8000/api/liste', {
                    headers: {
                        Authorization: `Bearer ${token}`  // Ajouter le jeton dans l'en-tête
                    }
                });
                utilisateurs.value = response.data.utilisateurs; // Mettre à jour les utilisateurs
                totalRecords.value = utilisateurs.value.length;  // Mettre à jour le nombre total
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Rediriger vers la page de connexion si non authentifié
                    console.error('Utilisateur non authentifié. Redirection vers la page de connexion.');
                    // Par exemple : this.$router.push('/login');
                } else {
                    console.error('Erreur lors de la récupération des utilisateurs :', error);
                }
            }
        };

        // Confirmation de suppression d'un utilisateur
        const confirmDeleteUser = (utilisateur) => {
            Swal.fire({
                title: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${utilisateur.nom} ?`,
                text: 'Cette action est irréversible !',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, supprimer !',
                cancelButtonText: 'Annuler'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`http://127.0.0.1:8000/api/utilisateurs/${utilisateur.id}`)
                        .then(() => {
                            Swal.fire('Supprimé !', "L'utilisateur a été supprimé.", 'success');
                            fetchUtilisateurs(); // Rafraîchir la liste après suppression
                        })
                        .catch((error) => {
                            console.error("Erreur lors de la suppression de l'utilisateur :", error);
                            Swal.fire('Erreur !', "Une erreur s'est produite lors de la suppression de l'utilisateur.", 'error');
                        });
                }
            });
        };

        // Formatage de la date sans l'heure
        const formatDateInscription = (utilisateur) => {
            if (!utilisateur.date_inscription) return '';
            const dateOnly = utilisateur.date_inscription.split(' ')[0];
            const date = new Date(dateOnly);
            return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
        };

        // Gestion de la pagination
        const onPage = (event) => {
            first.value = event.first;
        };

        // Exporter les utilisateurs au format CSV
        const exportCSV = () => {
            const csvContent = utilisateurs.value.map(utilisateur =>
                [utilisateur.id, utilisateur.nom, utilisateur.prenoms, utilisateur.telephone, utilisateur.pays, utilisateur.date_inscription].join(',')
            ).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, 'utilisateurs.csv');
        };

        onMounted(() => {
            fetchUtilisateurs(); // Charger les utilisateurs au montage du composant
        });

        return {
            utilisateurs,
            first,
            totalRecords,
            confirmDeleteUser,
            formatDateInscription,
            onPage,
            exportCSV
        };
    }
};
</script>

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
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV" />
                </template>
            </Toolbar>

            <div class="font-semibold text-xl mb-4">Liste des Utilisateurs</div>
            <DataTable :value="utilisateurs" scrollable scrollHeight="400px" paginator :rows="10" :first="first"
                :totalRecords="totalRecords" @page="onPage" class="mt-6">
                <Column field="id" header="ID" style="min-width: 100px" />
                <Column field="nom" header="Nom" style="min-width: 200px" />
                <Column field="prenoms" header="Prénoms" style="min-width: 200px" />
                <Column field="telephone" header="Téléphone" style="min-width: 200px" />
                <Column field="pays" header="Pays" style="min-width: 200px" />
                <Column field="date_inscription" header="Date d'inscription" :body="formatDateInscription"
                    style="min-width: 200px" />
                <Column header="Actions" style="min-width: 200px">
                    <template #body="slotProps">
                        <router-link :to="`/pages/updateUser/${slotProps.data.id}`">
                            <Button label="Modifier" icon="pi pi-pencil" outlined rounded class="mr-2" small />
                        </router-link>
                        <Button label="Supprimer" icon="pi pi-trash" outlined rounded severity="danger" small
                            @click="confirmDeleteUser(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
            <p v-if="!utilisateurs.length">Aucun utilisateur trouvé.</p>
        </div>
    </div>
</template>

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
