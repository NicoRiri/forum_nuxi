<script setup lang="ts">

const data = ref()
const page = ref(1)
const nbpage = ref()

function fetchForums() {
  $fetch("/api/forums/" + page.value).then((response) => {
    data.value = response
  })
}

function fetchNbPage() {
  $fetch("/api/forums/nbpage").then((response) => {
    nbpage.value = response.res
  })
}

onMounted(() => {
  fetchForums()
  fetchNbPage()
})

</script>

<template>
  <div>
    <h1>Forums</h1>

    <v-card v-for="d in data"
            class="text-center mt-8  mx-auto mb-5"
            border="opacity-50 sm"
            max-width="360"
            rounded="xl"
            variant="text">
      <router-link :to="'sujets/'+d.id"
                   class="text-decoration-none text-cyan-darken-1">
        <v-card-text class="text-h5 font-weight-black">{{ d.name }}</v-card-text>
      </router-link>
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