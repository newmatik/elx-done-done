<template>
  <v-app>
    <v-app-bar app color="white" elevation="0">
      <v-spacer></v-spacer>
      <img src="images/DoneDoneLogo.svg" alt="Done Done Logo" />
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
