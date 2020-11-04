<template>
  <div class="board-page mx-auto">
    <div class="d-flex justify-center mt-2">
      <router-link style="cursor: pointer;" to="/">
        <img height="50" src="images/DoneDoneLogo.svg" alt="Done Done Logo" />
      </router-link>
    </div>
    <div class="my-4 d-flex justify-center align-center">
      <v-icon
        v-clipboard="$route.params.id"
        @click="snackbar = true"
        small
        class="mr-1 clipboard"
      >
        mdi-clipboard-outline
      </v-icon>
      <p class="ma-0 grey--text text--darken-2">{{ $route.params.id }}</p>
    </div>
    <v-text-field
      v-model.trim="taskTitle"
      outlined
      hide-details
      label="Add a new task by pressing + or enter key"
      append-icon="mdi-plus-circle"
      @keydown.enter="addTask"
      @click:append="addTask"
    ></v-text-field>
    <v-main>
      <v-tabs v-model="tab" centered>
        <v-tab href="#all">All</v-tab>
        <v-tab href="#pending">Pending</v-tab>
        <v-tab href="#done">Done</v-tab>
        <v-tab href="#marked">Marked</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item value="all">
          <todo-list
            :items="items"
            empty-message="No task recorded. Add a task now."
          ></todo-list>
        </v-tab-item>
        <v-tab-item value="pending">
          <todo-list
            :items="pendingItems"
            empty-message="Stay motivated. Add a task now."
          ></todo-list>
        </v-tab-item>
        <v-tab-item value="done">
          <todo-list :items="doneItems" empty-message="Keep going"></todo-list>
        </v-tab-item>
        <v-tab-item value="marked">
          <todo-list
            :items="markedItems"
            empty-message="Tip: Keep important things on your bookmark."
          ></todo-list>
        </v-tab-item>
      </v-tabs-items>
    </v-main>

    <v-snackbar v-model="snackbar" timeout="2000">
      Copied to clipboard
    </v-snackbar>
  </div>
</template>

<script>
import TodoList from '@/components/TodoList.vue'
import { listRef } from '@/settings/dbRef'

export default {
  name: 'Board',
  components: {
    TodoList
  },
  data() {
    return {
      taskTitle: '',
      drag: false,
      items: [],
      tab: 'all',
      snackbar: false
    }
  },
  computed: {
    pendingItems() {
      return this.items.filter(item => item.status === 'pending')
    },
    doneItems() {
      return this.items.filter(item => item.status === 'done')
    },
    markedItems() {
      return this.items.filter(item => item.isBookmarked)
    },
    isHeadline() {
      return this.taskTitle.endsWith(':')
    },
    maxOrder() {
      return this.items.length === 0 ? 0 : this.items[0].order
    }
  },
  async created() {
    await listRef(this.$route.params.id)
      .orderBy('order', 'desc')
      .onSnapshot(querySnapshot => {
        let items = []
        querySnapshot.forEach(doc => {
          items.push({ id: doc.id, ...doc.data() })
        })
        this.items = items
      })
  },
  methods: {
    async addTask() {
      const isHeadline = this.isHeadline
      const taskTitle = this.taskTitle
      if (taskTitle) {
        this.taskTitle = ''
        await listRef(this.$route.params.id).add({
          taskTitle,
          status: 'pending',
          order: this.maxOrder + 1,
          isBookmarked: false,
          type: isHeadline ? 'headline' : 'task'
        })
      }
    }
  }
}
</script>

<style scoped>
.board-page {
  max-width: 720px;
}

.clipboard {
  cursor: pointer;
  user-select: none;
}

@media (max-width: 640px) {
  .board-page {
    padding: 0 1rem;
  }
}
</style>
