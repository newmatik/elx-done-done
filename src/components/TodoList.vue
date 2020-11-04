<template>
  <div>
    <draggable
      v-if="items.length > 0"
      :list="items"
      group="list"
      handle=".handle"
      @change="onMove"
    >
      <todo-item
        v-for="item in items"
        :key="item.id"
        :id="item.id"
        :task-title="item.taskTitle"
        :status="item.status"
        :type="item.type"
        :is-bookmarked="item.isBookmarked"
      ></todo-item>
    </draggable>
    <div v-else class="d-flex justify-center flex-column text-center mt-12">
      <img src="@/assets/no-results.svg" height="200" alt="no results" />
      <h5 class="mt-4 font-weight-bold blue-grey--text text--darken-3">
        {{ emptyMessage }}
      </h5>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import TodoItem from '@/components/TodoItem.vue'
import { listRef } from '@/settings/dbRef'

export default {
  name: 'TodoList',
  components: {
    draggable,
    TodoItem
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    emptyMessage: {
      type: String,
      default: ''
    }
  },
  computed: {
    reversedItems() {
      return [...this.items].reverse()
    }
  },
  methods: {
    adjustOrder() {
      this.reversedItems.forEach(async (item, i) => {
        await listRef(this.$route.params.id)
          .doc(item.id)
          .set({ order: i }, { merge: true })
      })
    },
    onMove() {
      this.adjustOrder()
    }
  }
}
</script>
