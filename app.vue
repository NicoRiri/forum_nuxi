<script setup lang="ts">

const {session, update, refresh, reset} = await useSession()


function deconnexion() {
  reset()
  navigateTo('/forums')
}

</script>

<template>
  <div>

    <div class="header">
      <v-btn v-if="!session.value" to="/connexion">Connexion</v-btn>
      <v-btn v-else @click="deconnexion">Deconnexion</v-btn>
      <router-link to="/forums" class="title">Le Pticoin</router-link>

    </div>

    <NuxtPage/>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  padding: 20px;
  text-align: center;
}

.v-btn{
  position: absolute;
  right: 20px;
}

.title{
  text-decoration: none;
  color: black;
  font-size: 30px;
  margin-right: auto;
  margin-left: auto;
  font-family: Arial, sans-serif;
}
</style>
