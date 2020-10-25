<template>
  <div style="max-width: 720px;" class="board-page mx-auto">
    <v-text-field
      v-model.trim="taskTitle"
      class="mt-12"
      outlined
      label="Add a new task by pressing + or enter key"
      append-icon="mdi-plus-circle"
      @keydown.enter="addTask"
      @click:append="addTask"
    ></v-text-field>
    <v-main class="pt-4">
      <v-tabs v-model="tab" class="mb-4">
        <v-tab href="#all">All</v-tab>
        <v-tab href="#pending">Pending</v-tab>
        <v-tab href="#done">Done</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item value="all">
          <draggable
            v-model="items"
            group="list"
            handle=".handle"
            @start="drag = true"
            @end="drag = false"
            @change="onMove"
          >
            <todo-item
              v-for="item in items"
              :key="item.id"
              :id="item.id"
              :task-title="item.taskTitle"
              :status="item.status"
              :type="item.type"
            ></todo-item>
          </draggable>
        </v-tab-item>
        <v-tab-item value="pending">
          <draggable
            v-model="items"
            group="list"
            handle=".handle"
            @start="drag = true"
            @end="drag = false"
            @change="onMove"
          >
            <todo-item
              v-for="item in pendingItems"
              :key="item.id"
              :id="item.id"
              :task-title="item.taskTitle"
              :status="item.status"
              :type="item.type"
            ></todo-item>
          </draggable>
        </v-tab-item>
        <v-tab-item value="done">
          <draggable
            v-model="items"
            group="list"
            handle=".handle"
            @start="drag = true"
            @end="drag = false"
            @change="onMove"
          >
            <todo-item
              v-for="item in doneItems"
              :key="item.id"
              :id="item.id"
              :task-title="item.taskTitle"
              :status="item.status"
              :type="item.type"
            ></todo-item>
          </draggable>
        </v-tab-item>
      </v-tabs-items>
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
      items: [],
      tab: 'all'
    }
  },
  computed: {
    pendingItems() {
      return this.items.filter(item => item.status === 'pending')
    },
    doneItems() {
      return this.items.filter(item => item.status === 'done')
    },
    isHeadline() {
      return this.taskTitle.endsWith(':')
    },
    maxOrder() {
      return this.items.length === 0
        ? 0
        : this.items[this.items.length - 1].order
    }
  },
  async created() {
    db.collection('boards')
      .doc(this.$route.params.id)
      .collection('list')
      .orderBy('order')
      .onSnapshot(querySnapshot => {
        let items = []
        querySnapshot.forEach(doc => {
          items.push({ id: doc.id, ...doc.data() })
        })
        this.items = items
      })
  },
  methods: {
    adjustOrder() {
      this.items.forEach(async (item, i) => {
        await db
          .collection('boards')
          .doc(this.$route.params.id)
          .collection('list')
          .doc(item.id)
          .set({ order: i }, { merge: true })
      })
    },
    onMove() {
      this.adjustOrder()
    },
    async addTask() {
      const isHeadline = this.isHeadline
      const taskTitle = isHeadline
        ? this.taskTitle.slice(0, -1)
        : this.taskTitle
      if (taskTitle) {
        this.taskTitle = ''
        await db
          .collection('boards')
          .doc(this.$route.params.id)
          .collection('list')
          .add({
            taskTitle,
            status: 'pending',
            order: this.maxOrder + 1,
            type: isHeadline ? 'headline' : 'task'
          })
      }
    }
  }
}
</script>

<style scoped>
@media (max-width: 640px) {
  .board-page {
    padding: 0 1rem;
  }
}
</style>
