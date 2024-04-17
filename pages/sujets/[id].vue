<script setup lang="ts">
const route = useRoute()
const idForum = ref(route.params.id)
const data = ref()
const page = ref(1)
const nbpage = ref()
const {session, refresh, update, reset} = await useSession()
await update({"userid": 10})
const connected = ref(false)
if (session.value.userid) {
  connected.value = true
}


function fetchSujet() {
  $fetch("/api/sujets/" + idForum.value + "/" + page.value).then((response) => {
    data.value = response
  })
}


onMounted(() => {
  //fetchSujet()
})

</script>

<template>
  <div>
    <h1>Sujets</h1>
    <router-link to="/forums">
      <v-btn class="text-cyan-darken-1">
        Retour vers les forums
      </v-btn>
    </router-link>
    <router-link :to="'/newSujet/'+idForum" v-show="connected">
      <v-btn class="float-right mr-3 text-deep-orange-darken-2">
        Nouveau Sujet
      </v-btn>
    </router-link>
    <v-card v-for="d in data"
            class="text-center mt-8  mx-auto mb-5"
            border="opacity-50 sm"
            max-width="360"
            rounded="xl"
            variant="text">
      <router-link :to="'message/'+d.id"
                   class="text-decoration-none text-deep-orange-darken-2">
        <v-card-text class="text-h5 font-weight-black">
          {{ d.nom }}
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