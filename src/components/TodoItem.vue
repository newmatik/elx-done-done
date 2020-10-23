<template>
  <v-card class="d-flex justify-space-between pa-4 mb-2">
    <div class="d-flex align-center">
      <v-icon style="cursor: pointer;">
        mdi-drag-vertical
      </v-icon>
      <p class="text-body-1 mb-0 ml-4">{{ title }}</p>
    </div>
    <div>
      <v-btn class="mx-2" fab dark x-small color="success">
        <v-icon dark>
          mdi-check
        </v-icon>
      </v-btn>
      <v-btn class="mx-2" fab dark x-small color="error">
        <v-icon dark>
          mdi-trash-can
        </v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'TodoItem',
  props: {
    title: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'todo'
    }
  }
}
</script>
