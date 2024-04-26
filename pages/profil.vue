<script setup lang="ts">
import {connecter,admin,user_id,pseudo,mdp} from "~/app.vue";
const {session, update, refresh, reset} = await useSession()
const changemdp = ref(false)
const newmdp1 = ref("")
const newmdp2 = ref("")

function changeMdp(){
  changemdp.value = !changemdp.value
}

function postMDP(){
  if(newmdp1.value === newmdp2.value){
    $fetch("/api/users",{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(pseudo.value + ':' + mdp.value)
      },
      body:{
        "password": newmdp1.value
      }
    }).then(() => {
      mdp.value = newmdp1.value
      navigateTo("/forums")
    })
  }
}

onMounted(() =>{
  refresh()
})
</script>

<template>
<v-card
    class="text-center mt-16  mx-auto mb-5"
    border="opacity-50 sm"
    max-width="500"
    rounded="xl"
    variant="text">
  <v-card-title>
  Pseudo : {{session.login}}
  </v-card-title>
  <v-text-field v-show="changemdp" placeholder="Nouveau mot de passe" v-model="newmdp1" type="password"></v-text-field>
  <v-text-field v-show="changemdp" placeholder="Confiramtion du mot de passe" v-model="newmdp2" type="password"></v-text-field>
  <v-btn class="w-100" @click="postMDP" v-show="changemdp">Enregistrer le nouveau mot de passe</v-btn>
  <v-btn class="w-100" @click="changeMdp" v-show="!changemdp">changer le mot de passe</v-btn>
</v-card>

</template>

<style scoped>

</style>