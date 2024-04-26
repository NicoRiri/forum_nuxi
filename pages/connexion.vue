<script setup lang="ts">

import {connected} from "~/app.vue";

const login = ref('')
const password = ref('')
const error = ref('')
const {session, update, refresh, reset} = await useSession()

function connexion() {
  if (!login.value || !password.value) {
    error.value = "Veuillez remplir tous les champs"
    return
  }
  $fetch('/api/connexion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(login.value + ':' + password.value)
    }
  }).then(async (response) => {
    if (response.message === "connecté") {
      await update({
        "login": login.value,
        "password": password.value,
        "admin": response.admin,
        "user_id": response.id
      })
      connected()
      navigateTo('/forums')
    } else {
      error.value = response.message
    }
  }).catch(() => {
    error.value = "Erreur lors de la connexion"
  })
}

</script>

<template>
  <div>
    <h1>Connexion</h1>

    <div class="form">
      <v-text-field v-model="login" label="Login" required></v-text-field>
      <v-text-field v-model="password" label="Mot de passe" type="password" required></v-text-field>
      <p>Vous n'avez pas de compte? <router-link to="/inscription">S'inscrire</router-link></p>
      <v-btn @click="connexion">Connexion</v-btn>
      <p class="error">{{ error }}</p>
    </div>

  </div>
</template>

<style scoped>
h1 {
  font-family: Arial, sans-serif;
  font-size: 50px;
  text-align: center;
  margin-top: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.error {
  color: red;
  font-size: 20px;
  margin-top: 10px;
}
p{
  margin-bottom: 10px;
  text-align: center;
}

.v-text-field {
  width: 25%;
}
</style>