<template>
  <FloatingConfigurator />
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
      <div class="flex flex-col items-center justify-center">
          <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
              <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                  <div class="text-center mb-8">
                      <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-8 w-16 shrink-0 mx-auto">
                          <!-- SVG content -->
                      </svg>
                      <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Se Connecter</div>
                      <span class="text-muted-color font-medium">Connectez-vous pour rester connecté.</span>
                  </div>
                  <form @submit.prevent="login"> 
                    <div>
                      <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                      <InputText id="email1" type="text" placeholder="email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                      <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                      <Password id="password1" v-model="mot_de_passe" placeholder="Password" class="mb-4" fluid :feedback="false"></Password>

                      <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                          <div class="flex items-center">
                              <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                              <label for="rememberme1">Se souvenir de moi</label>
                          </div>
                          <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Mot de passe oublié ?</span>
                      </div>
                      <div class="d-flex justify-content-center" style="background-color: #007bff; padding: 1.5rem; border-radius: 10px; text-align: center;">
                      <button type="submit" v-if="!loading" class="btn btn-light" :disabled="isDisabled" style="font-weight: bold; font-size: 1.1rem; color: white;">Se Connecter</button>
                      <b-button v-else variant="light" disabled>
                          <b-spinner small type="grow"></b-spinner>
                          Se Connecter
                      </b-button>
                      </div>
                      <p class="mt-3 text-center">Vous n'avez pas de compte ?<router-link to="/pages/addUser" class="text-underline">Cliquez ici pour vous inscrire.</router-link></p>
                  </div>
                  </form>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export default {
  data() {
      return {
          email: "",
          mot_de_passe: "",
          checked: false,
          loading: false,
      };
  },
  methods: {
      login() {
          this.loading = true;
          const data = {
              email: this.email,
              mot_de_passe: this.mot_de_passe
          };
          axios.post("http://127.0.0.1:8000/api/login", data)
              .then(response => {
                  if (response.status === 200) {
                      const token = response.data.token;
                      const user = response.data.user;
                      localStorage.setItem('token', token);
                      localStorage.setItem('user', JSON.stringify(user));
                      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                      this.$router.push('/');
                  } else {
                      console.log('Identifiant incorrect');
                  }
              })
              .catch((error) => {
                  console.error('Erreur lors de la connexion', error);
                  let errorMessage = 'Erreur de connexion';
                  if (error.response && (error.response.status === 422 || error.response.status === 401)) {
                      errorMessage = error.response.data.message;
                  }
                  Swal.fire({
                      icon: 'error',
                      title: 'Erreur!',
                      text: errorMessage
                  });
              })
              .finally(() => {
                  this.loading = false;
              });
      }
  },
  computed: {
      isDisabled() {
          return !this.email || !this.mot_de_passe || this.loading;
      }
  }
};
</script>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}
.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
