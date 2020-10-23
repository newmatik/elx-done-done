<template>
  <v-app style="background-color: #ffa000;">
    <v-app-bar app color="primary" dark elevation="0">
      <v-spacer></v-spacer>
      <h1>Braven</h1>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>
