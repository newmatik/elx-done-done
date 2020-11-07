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
    <slot v-else name="empty"></slot>
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
