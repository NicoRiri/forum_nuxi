<script setup lang="ts">
import {connecter,admin} from "~/app.vue";
const login = ref('')
const password = ref('')
const error = ref('')
const {session, update, refresh, reset} = await useSession()

function inscription() {
  if (!login.value || !password.value) {
    error.value = "Veuillez remplir tous les champs"
    return
  }
  $fetch('/api/inscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(login.value + ':' + password.value)
    }
  }).then(async (response) => {
    if (response.message === "le compte a bien été créé") {
      await update({
        "login": login.value,
        "password": password.value
      })
      admin.value = response.admin
      connecter.value = true
      navigateTo('/forums')
    } else {
      error.value = response.message
    }
  }).catch(() => {
    error.value = "Erreur lors de l'incription"
  })
}


</script>

<template>
  <div>
    <h1>Inscription</h1>

    <div class="form">
      <v-text-field v-model="login" label="Login" required></v-text-field>
      <v-text-field v-model="password" label="Mot de passe" type="password" required></v-text-field>

      <v-btn @click="inscription">S'inscrire</v-btn>
      <p>{{ error }}</p>
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

p {
  color: red;
  font-size: 20px;
  margin-top: 10px;
}

.v-text-field {
  width: 25%;
}
</style>