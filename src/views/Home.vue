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
    <v-main>
      <draggable
        v-model="items"
        group="list"
        @start="drag = true"
        @end="drag = false"
      >
        <todo-item
          v-for="item in items"
          :key="item.id"
          :title="item.title"
          :status="item.status"
        ></todo-item>
      </draggable>
    </v-main>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import TodoItem from '@/components/TodoItem.vue'

export default {
  name: 'Home',
  components: {
    draggable,
    TodoItem
  },
  data() {
    return {
      drag: false,
      items: [
        { id: 1, title: 'Sample todo', status: 'todo' },
        { id: 2, title: 'Sample todo 2', status: 'todo' }
      ]
    }
  }
}
</script>
