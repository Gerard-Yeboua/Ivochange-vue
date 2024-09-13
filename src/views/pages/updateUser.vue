<template>
    <div id="page-steppers">
        <Fluid>
            <div class="card w-full">
                <div class="font-semibold text-xl mb-4">Créer un Utilisateur</div>

                <!-- Champs du formulaire -->
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label for="nom">Nom</label>
                        <InputText id="nom" v-model="utilisateurs.nom" type="text" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="prenoms">Prénoms</label>
                        <InputText id="prenoms" v-model="utilisateurs.prenoms" type="text" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="telephone">Téléphone</label>
                        <InputText id="telephone" v-model="utilisateurs.telephone" type="text" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="pays">Pays</label>
                        <InputText id="pays" v-model="utilisateurs.pays" type="text" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="email">Email</label>
                        <InputText id="email" v-model="utilisateurs.email" type="email" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="mot_de_passe">Mot de Passe</label>
                        <InputText id="mot_de_passe" v-model="utilisateurs.mot_de_passe" type="password" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="date_inscription">Date d'Inscription</label>
                        <InputText id="date_inscription" v-model="utilisateurs.date_inscription" type="date" />
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