<script lang="ts">

export const connecter = ref(false)

export function connected() {
  connecter.value = true
}
</script>

<script setup lang="ts">


const {session, update, refresh, reset} = await useSession()

if (session.value.login) {
  connected()
}

function deconnexion() {
  reset()
  connecter.value = false
  navigateTo('/forums')
}

onMounted(() => {
  refresh()
})

</script>

<template>
  <div>

    <div class="header">
      <router-link to="/forums" class="text-decoration-none text-black text-h3 titre">Le Pticoin</router-link>
      <v-btn v-if="!connecter" to="/connexion" class="bouton">Connexion</v-btn>
      <div v-else class="bouton">
        <router-link to="/admin">
          <v-btn v-if="session.admin" class="mr-3">Creer un compte admin</v-btn>
        </router-link>
        <router-link to="/profil">
          <v-btn>Profil</v-btn>
        </router-link>
        <v-btn @click="deconnexion" class="ml-3">Deconnexion</v-btn>
      </div>

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

.bouton {
  position: absolute;
  right: 20px;
}

.titre {
  margin: 0 auto;
}
</style>
