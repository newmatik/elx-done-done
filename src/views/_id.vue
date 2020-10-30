<template>
  <div class="board-page mx-auto">
    <div class="d-flex justify-center mt-6">
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
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item value="all">
          <draggable
            v-if="items.length > 0"
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
          <div
            v-else
            class="d-flex justify-center flex-column text-center mt-12"
          >
            <img src="@/assets/no-results.svg" height="200" alt="no results" />
            <h5 class="mt-4 font-weight-bold blue-grey--text text--darken-3">
              No task recorded. Add a task now.
            </h5>
          </div>
        </v-tab-item>
        <v-tab-item value="pending">
          <draggable
            v-if="pendingItems.length > 0"
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
          <div
            v-else
            class="d-flex justify-center flex-column text-center mt-12"
          >
            <img src="@/assets/no-results.svg" height="200" alt="no results" />
            <h5 class="mt-4 font-weight-bold blue-grey--text text--darken-3">
              Stay motivated. Add a task now.
            </h5>
          </div>
        </v-tab-item>
        <v-tab-item value="done">
          <draggable
            v-if="doneItems.length > 0"
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
          <div
            v-else
            class="d-flex justify-center flex-column text-center mt-12"
          >
            <img src="@/assets/no-results.svg" height="200" alt="no results" />
            <h5 class="mt-4 font-weight-bold blue-grey--text text--darken-3">
              Keep going.
            </h5>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-main>

    <v-snackbar v-model="snackbar" timeout="2000">
      Copied to clipboard
    </v-snackbar>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import TodoItem from '@/components/TodoItem.vue'
import { db } from '@/settings/db'

export default {
  name: 'Board',
  components: {
    draggable,
    TodoItem
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
    reversedItems() {
      return [...this.items].reverse()
    },
    isHeadline() {
      return this.taskTitle.endsWith(':')
    },
    maxOrder() {
      return this.items.length === 0 ? 0 : this.items[0].order
    }
  },
  async created() {
    db.collection('boards')
      .doc(this.$route.params.id)
      .collection('list')
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
    adjustOrder() {
      this.reversedItems.forEach(async (item, i) => {
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
