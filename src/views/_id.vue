<template>
  <div style="max-width: 720px;" class="home mx-auto">
    <v-card class="d-flex align-center mt-12 pa-4">
      <v-text-field
        v-model="taskTitle"
        prepend-inner-icon="mdi-clipboard-outline"
        class="mr-4"
        label="Add a new task by pressing + or enter key"
      ></v-text-field>
      <v-btn @click="addTask" class="mx-2" fab small elevation="0">
        <v-icon>
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
        @change="log"
      >
        <todo-item
          v-for="item in items"
          :key="item.id"
          :id="item.id"
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
import { db } from '@/settings/db'

export default {
  name: 'Home',
  components: {
    draggable,
    TodoItem
  },
  data() {
    return {
      taskTitle: '',
      drag: false,
      items: []
    }
  },
  firestore() {
    return {
      items: db.collection(`boards/${this.$route.params.id}/list`)
    }
  },
  methods: {
    log(value) {
      console.log(value)
    },
    async addTask() {
      await db
        .collection('boards')
        .doc(this.$route.params.id)
        .collection('list')
        .add({
          title: this.taskTitle,
          status: 'todo'
        })
      this.taskTitle = ''
    }
  }
}
</script>