<script setup lang="ts">
import {connecter,admin} from "~/app.vue";
const route = useRoute()
const idForum = ref(route.params.id)
const data = ref()
const page = ref(1)
const nbpage = ref()
const error = ref("")
const {session, refresh, update, reset} = await useSession()

let ws
const connect = async () => {
  const isSecure = location.protocol === "https:";
  const url = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";
  if (ws) {
    ws.close();
  }
  ws = new WebSocket(url);
  ws.addEventListener("message", (event) => {
    fetchSujet()
  });
  await new Promise((resolve) => ws.addEventListener("open", resolve));
};

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

function deleteSujet(id){
  let ids = id.toString()
  $fetch("/api/sujets",{
    method:'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(session.value.login + ':' + session.value.password)
    },
    body:{
      "sujet_id": ids
    }
  }).then(() =>{
    ws.send("ping")
  })
}

function toNewSujet() {
  if (connecter.value) {
    ws.close()
    navigateTo("/newSujet/" + idForum.value)
  } else {
    error.value = "Veuillez vous connecter"
  }
}

onMounted(() => {
  fetchSujet()
  fetchNbPage()
  refresh()
  connect()
})

</script>

<template>
  <div class="mb-16">
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
            class="text-center mt-10  mx-auto"
            border="opacity-50 sm"
            max-width="360"
            rounded="xl"
            variant="text">
      <router-link :to="'/message/'+d.id"
                   class="text-decoration-none text-deep-orange-darken-2">
        <v-card-title>
          {{d.nom}}
        </v-card-title>
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
      <v-btn v-show="connecter && admin" @click="deleteSujet(d.id)">supprimer le sujet</v-btn>
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