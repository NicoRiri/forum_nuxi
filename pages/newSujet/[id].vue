<script setup lang="ts">
import {connecter,admin,user_id,pseudo,mdp} from "~/app.vue";
const route = useRoute()
const idForum = ref(route.params.id)
const error = ref("")
const titre = ref("")
const message = ref("")
const {session, update, refresh, reset} = await useSession()


let ws
const connect = async () => {
  const isSecure = location.protocol === "https:";
  const url = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";
  if (ws) {
    ws.close();
  }
  ws = new WebSocket(url);
  await new Promise((resolve) => ws.addEventListener("open", resolve));
};

async function postSujet() {
  if (titre.value != "" && message.value != "") {
    await $fetch("/api/sujets/" + idForum.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(pseudo.value + ':' + mdp.value)
      },
      body: {
        "nom": titre.value,
        "message_initial": message.value
      }
    }).then(() => {
      ws.send("ping")
      ws.close()
      navigateTo("/sujets/" + idForum.value)
    })
    
  } else {
    error.value = "Il faut remplir tout les champs"
  }
}

onMounted(() => {
  refresh()
})

</script>

<template>
  <div>
    <h1>
      Nouveau Sujet
    </h1>
    <router-link :to="'/sujets/'+idForum" class="float-left">
      <v-btn class="text-deep-orange-darken-2 ml-3">
        Retour vers les sujets
      </v-btn>
    </router-link>
    <v-card class="mx-auto mt-13"
            border="opacity-50 sm"
            max-width="600"
            rounded="xl"
            variant="text">
      <v-text-field placeholder="Titre"
                    v-model="titre">
      </v-text-field>
      <v-textarea placeholder="Message"
                  v-model="message">
      </v-textarea>
      <v-btn width="100%"
             class="mr-3 text-deep-orange-darken-2"
             @click="postSujet">
        Creer un nouveau sujet
      </v-btn>
    </v-card>
    <p class="error">{{ error }}</p>
  </div>
</template>

<style scoped>

h1 {
  font-family: Arial, sans-serif;
  font-size: 50px;
  text-align: center;
  margin-top: 50px;
}

.error {
  color: red;
  font-size: 20px;
  margin-top: 10px;
  text-align: center;
}
</style>