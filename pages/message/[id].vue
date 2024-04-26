<script setup lang="ts">
import {connecter,admin,user_id,pseudo,mdp} from "~/app.vue";
const route = useRoute()
const idSujet = ref(route.params.id)
const data = ref()
const page = ref(1)
const nbpage = ref()
const error = ref("")
const {session, refresh, update, reset} = await useSession()
const newmess = ref(false)
const message = ref("")
const modif = ref({modif: false, id: -1})
const modifmess = ref("")
const errorMess = ref("")



let ws
const connect = async () => {
  const isSecure = location.protocol === "https:";
  const url = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";
  if (ws) {
    ws.close();
  }
  ws = new WebSocket(url);
  ws.addEventListener("message", (event) => {
    fetchMessage()
  });
  await new Promise((resolve) => ws.addEventListener("open", resolve));
};


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

function formMessage() {
  newmess.value = !newmess.value
}

function deleteMessage(id) {
  let idm = id.toString()
  $fetch("/api/messages", {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(pseudo.value + ':' + mdp.value)
    },
    body: {
      "message_id": idm
    }
  }).then(() => {
    ws.send("ping")
  })
}

function ajouterMessage() {
  if (message.value != "") {
    $fetch("/api/messages/" + idSujet.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(pseudo.value + ':' + mdp.value)
      },
      body: {
        "contenu": message.value
      }
    }).then((response) => {
      ws.send("ping")
    })

    newmess.value = false
  } else {
    errorMess.value = "Il faut écrire un message"
  }
}

function modifMessage(id) {
  let idm = id.toString()
  if (modifmess.value !== "") {
    $fetch("/api/messages", {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(pseudo.value + ':' + mdp.value)
      },
      body: {
        "contenu": modifmess.value,
        "message_id": idm
      }
    }).then((response) => {
      ws.send("ping")
      modifmess.value = ""
      toggleModif(-1)
    })
  }
}

function toggleModif(id) {
  if (modif.value.modif) {
    modif.value.modif = false
    modif.value.id = -1
  }
  else{
    modif.value.modif = true
    modif.value.id = id
  }
}

function toForum() {
  ws.close()
  navigateTo("/forums")
}

onMounted(() => {
  fetchMessage()
  fetchNbPage()
  refresh()
  connect()
})

</script>

<template>
  <div class="mb-16">
    <div class="text-center mb-16">
      <h1>Messages</h1>
      <v-btn class="text-cyan-darken-1 ml-3 float-left" @click="toForum">
        Retour vers les forums
      </v-btn>
      <v-btn class="mt-3 float-right mr-3 text-green-lighten-2" v-show="connecter" @click="formMessage">ajouter un
        message
      </v-btn>
      <p>{{ error }}</p>
    </div>
    <v-card class="mx-auto mt-13"
            border="opacity-50 sm"
            max-width="600"
            rounded="xl"
            variant="text"
            v-show="newmess">
      <v-textarea placeholder="Message"
                  v-model="message">
      </v-textarea>
      <v-btn width="100%"
             class="mr-3 text-deep-orange-darken-2"
             @click="ajouterMessage">
        Envoyer le message
      </v-btn>
    </v-card>
    <p>{{ errorMess }}</p>


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
      <v-text-field v-if="modif.modif && modif.id == d.id" :placeholder="d.contenu"
                    class="text-green-accent-4"
                    v-model="modifmess">
      </v-text-field>
      <v-card-text v-else>
        Message :
        {{ d.contenu }}
      </v-card-text>
      <v-card-text class="pt-0">
        Date du message :
        {{ d.timestamp.substring(0, 10) }}
      </v-card-text>
      <v-btn v-show="modif.modif && modif.id == d.id" @click="modifMessage(d.id)">
        Envoyer
      </v-btn><v-btn v-show="connecter && (user_id == d.auteur_id || admin)" @click="toggleModif(d.id)">
        modifier le message
      </v-btn>
      <v-btn v-show="connecter && admin" @click="deleteMessage(d.id)">supprimer le message</v-btn>
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