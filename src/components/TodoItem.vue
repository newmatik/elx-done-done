<template>
  <v-card class="d-flex justify-space-between pa-4 mb-2">
    <div class="d-flex align-center">
      <v-btn class="mx-2" fab x-small elevation="0">
        <v-icon>
          mdi-check
        </v-icon>
      </v-btn>
      <p class="text-body-1 mb-0 ml-4">
        <strong>{{ title }}</strong>
      </p>
    </div>
    <div>
      <v-btn @click="removeTask" class="mx-2" fab x-small elevation="0">
        <v-icon>
          mdi-trash-can
        </v-icon>
      </v-btn>
      <v-icon style="cursor: pointer;">
        mdi-drag-vertical
      </v-icon>
    </div>
  </v-card>
</template>

<script>
import { db } from '@/settings/db'

export default {
  name: 'TodoItem',
  props: {
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'todo'
    }
  },
  methods: {
    async removeTask() {
      await db
        .collection('boards')
        .doc(this.$route.params.id)
        .collection('list')
        .doc(this.id)
        .delete()
    }
  }
}
</script>
