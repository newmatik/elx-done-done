<template>
  <div style="max-width: 720px;" class="home mx-auto">
    <v-card class="d-flex align-center mt-12 pa-4">
      <v-text-field
        prepend-inner-icon="mdi-clipboard-outline"
        class="mr-4"
        label="Enter a task..."
      ></v-text-field>
      <v-btn class="mx-2" fab dark small color="primary">
        <v-icon dark>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-card>
    <v-content>
      <todo-item
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :status="item.status"
      ></todo-item>
    </v-content>
  </div>
</template>

<script>
import TodoItem from '@/components/TodoItem.vue'
export default {
  name: 'Home',
  components: {
    TodoItem
  },
  data() {
    return {
      items: [
        { id: 1, title: 'Sample todo', status: 'todo' },
        { id: 2, title: 'Sample todo 2', status: 'todo' }
      ]
    }
  }
}
</script>
