<script setup lang="ts">

const titre = ref("")
const message = ref("")

</script>

<template>
  <div>
    <h1>
      Nouveau Sujet
    </h1>

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
             class="mr-3 text-deep-orange-darken-2">
        Creer un nouveau sujet
      </v-btn>
    </v-card>
  </div>
</template>

<style scoped>

h1 {
  font-family: Arial, sans-serif;
  font-size: 50px;
  text-align: center;
  margin-top: 50px;
}
</style>