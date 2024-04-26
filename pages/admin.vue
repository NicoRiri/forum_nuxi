<script setup lang="ts">
import {connecter,admin,user_id,pseudo,mdp} from "~/app.vue";
const {session, update, refresh, reset} = await useSession()
const login = ref("")
const mdp1 = ref("")
const mdp2 = ref("")
const error = ref("")

function postAdmin() {
  if (login.value !== "" && mdp1.value === mdp2.value) {
    $fetch("/api/inscription/admin", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(pseudo.value + ':' + mdp.value)
      },
      body: {
        "nom": login.value,
        "password": mdp1.value
      }
    }).then((response) => {
      error.value = response.error
    })
  } else {
    error.value = "Il y a une erreur dans la création du compte"
  }
}
</script>

<template>
  <div class="form">
    <v-text-field v-model="login" label="Login"></v-text-field>
    <v-text-field v-model="mdp1" label="Mot de passe" type="password"></v-text-field>
    <v-text-field v-model="mdp2" label="Confirmer mot de passe" type="password"></v-text-field>

    <v-btn @click="postAdmin">Creer le compte</v-btn>
    <p class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
}
.error {
  color: red;
  font-size: 20px;
  margin-top: 10px;
}
.v-text-field {
  width: 25%;
}
</style>