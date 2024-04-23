<script setup lang="ts">
const route = useRoute()
const idForum = ref(route.params.id)
const data = ref()
const page = ref(1)
const nbpage = ref()
const error = ref("")
const {session, refresh, update, reset} = await useSession()
const connected = ref(false)
if (session.value!.userid) {
  connected.value = true
}


function fetchSujet() {
  $fetch("/api/sujets/" + idForum.value + "/" + page.value).then((response) => {
    data.value = response
  })
}

function fetchNbPage(){
  $fetch("/api/sujets/"+idForum.value).then((response) =>{
    nbpage.value = response.nbPage
  })
}

function toNewSujet() {
  if (connected.value) {
    navigateTo("/newSujet/" + idForum)
  } else {
    error.value = "Veuillez vous connecter"
  }
}

onMounted(() => {
  fetchSujet()
  fetchNbPage()
})

</script>

<template>
  <div>
    <h1>Sujets</h1>
    <router-link to="/forums">
      <v-btn class="text-cyan-darken-1 ml-3">
        Retour vers les forums
      </v-btn>
    </router-link>
    <div class="float-right mr-3">
      <v-btn class="text-deep-orange-darken-2" @click="toNewSujet">
        Nouveau Sujet
      </v-btn>
      <p class="text-red-darken-1 mt-3">
        {{ error }}
      </p>
    </div>
    <v-card v-for="d in data"
            class="text-center mt-8  mx-auto mb-5"
            border="opacity-50 sm"
            max-width="360"
            rounded="xl"
            variant="text">
      <router-link :to="'/message/'+d.id"
                   class="text-decoration-none text-deep-orange-darken-2">
        <v-card-text class="pb-0">
          Auteur du sujet :
          {{ d.auteur }}
        </v-card-text>
        <v-card-text>
          Date de création du sujet :
          {{ d.date.substring(0,10) }}
        </v-card-text>
        <v-card-text class="pt-0">
          Auteur du dernier message :
          {{ d.message_der_auteur }}
        </v-card-text>
      </router-link>
    </v-card>

    <v-pagination v-show="nbpage > 1" v-model="page" :length="nbpage" @click="fetchSujet"></v-pagination>
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