<script setup lang="ts">
const route = useRoute()
const idSujet = ref(route.params.id)
const data = ref()
const page = ref(1)
const nbpage = ref()
const error = ref("")
const {session, refresh, update, reset} = await useSession()
const connected = ref(false)
if (session.value!.userid) {
  connected.value = true
}

function fetchMessage() {
  $fetch("/api/messages/" + idSujet.value + "/" + page.value).then((response) => {
    data.value = response
  })
}

function fetchNbPage() {
  $fetch("/api/messages/" + idSujet.value).then((response) => {
    nbpage.value = response.nbPage
  })
}

function ajouterMessage() {

}


onMounted(() => {
  fetchMessage()
  fetchNbPage()
})
</script>

<template>
  <div>
    <div class="text-center mb-16">
      <h1>Messages</h1>
      <router-link :to="'/sujets/'+idSujet" class="float-left float-start">
        <v-btn class="text-deep-orange-darken-2 ml-3">
          Retour vers les sujets
        </v-btn>
      </router-link>
      <v-btn class="mt-3 float-right mr-3 text-green-lighten-2" v-show="connected">ajouter un message</v-btn>
      <p>{{ error }}</p>
    </div>
    <v-card v-for="d in data"
            class="text-center mt-8  mx-auto mb-5 text-green-lighten-2"
            border="opacity-50 sm"
            max-width="360"
            rounded="xl"
            variant="text">
      <v-card-text class="pb-0">
        Auteur du message :
        {{ d.auteur }}
      </v-card-text>
      <v-card-text>
        Message :
        {{ d.contenu }}
      </v-card-text>
      <v-card-text class="pt-0">
        Date du message :
        {{ d.timestamp.substring(0, 10) }}
      </v-card-text>
    </v-card>
    <v-pagination v-show="nbpage > 1" v-model="page" :length="nbpage" @click="fetchMessage"></v-pagination>
  </div>
</template>

<style scoped>

h1 {
  font-family: Arial, sans-serif;
  font-size: 50px;
  text-align: center;
  margin-top: 20px;
}
</style>