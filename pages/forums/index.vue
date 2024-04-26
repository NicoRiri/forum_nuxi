<script setup lang="ts">
const {session, refresh, update, reset} = await useSession()
const data = ref()
const page = ref(1)
const nbpage = ref()
const connected = ref(false)
const newforum = ref(false)
const forum = ref("")
const errorForum = ref("")
if (session.value!.login) {
  connected.value = true
}

let ws
const connect = async () => {
  const isSecure = location.protocol === "https:";
  const url = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";
  if (ws) {
    ws.close();
  }
  ws = new WebSocket(url);
  ws.addEventListener("message", (event) => {
    fetchForums()
  });
  await new Promise((resolve) => ws.addEventListener("open", resolve));
};

async function fetchForums() {
  await $fetch("/api/forums/" + page.value).then((response) => {
    data.value = response
  })
}

async function fetchNbPage() {
  await $fetch("/api/forums").then((response) => {
    nbpage.value = response.nbPage
  })
}

function formForum() {
  newforum.value = !newforum.value
}


function ajouterForum() {
  if (forum.value != "") {
    $fetch("/api/forums", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(session.value.login + ':' + session.value.password)
      },
      body: {
        "nom": forum.value
      }
    }).then((response) => {
      ws.send("ping")
    })

    newforum.value = false
  } else {
    errorForum.value = "Il faut écrire un nom"
  }
}


function deleteForum(id){
  let idf = id.toString()
  $fetch("/api/forums",{
    method:'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(session.value.login + ':' + session.value.password)
    },
    body:{
      "forum_id": idf
    }
  }).then(() =>{
    ws.send("ping")
  })
}

onMounted(() => {
  fetchForums()
  fetchNbPage()
  refresh()
  connect()
})

</script>

<template>
  <div class="mb-16">
    <h1>Forums</h1>
    <v-btn class="mt-3 float-right mr-3 text-cyan-darken-1" v-show="session.admin" @click="formForum">Creer un forum
    </v-btn>

    <v-card class="mx-auto mt-13"
            border="opacity-50 sm"
            max-width="600"
            rounded="xl"
            variant="text"
            v-show="newforum">
      <v-text-field placeholder="Nom du forum"
                  v-model="forum">
      </v-text-field>
      <v-btn width="100%"
             class="mr-3 text-cyan-darken-1"
             @click="ajouterForum">
        Envoyer le message
      </v-btn>
    </v-card>
    <p>{{ errorForum }}</p>

    <v-card v-for="d in data"
            class="text-center mt-16  mx-auto mb-5"
            border="opacity-50 sm"
            max-width="360"
            rounded="xl"
            variant="text">
      <router-link :to="'/sujets/'+d.id"
                   class="text-decoration-none text-cyan-darken-1">
        <v-card-text class="text-h5 font-weight-black">{{ d.name }}</v-card-text>
      </router-link>
      <v-btn v-show="connected && session.admin" @click="deleteForum(d.id)">supprimer le forum</v-btn>
    </v-card>

    <v-pagination v-show="nbpage > 1" v-model="page" :length="nbpage" @click="fetchForums"></v-pagination>
  </div>
</template>

<style scoped>

h1 {
  font-family: Arial, sans-serif;
  font-size: 50px;
  text-align: center;
  margin-top: 20px;
}

a {
  width: 25%;
}


</style>