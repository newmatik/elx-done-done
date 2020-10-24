<template>
  <v-card
    :color="status === 'done' ? 'blue-grey lighten-5' : ''"
    class="d-flex justify-space-between pa-4 mb-2"
    elevation="0"
    outlined
  >
    <div style="width: 50%" class="d-flex align-center">
      <div>
        <v-checkbox
          class="ma-0 pa-0"
          :input-value="status === 'done'"
          hide-details
          @change="changeTaskStatus"
        ></v-checkbox>
      </div>
      <v-text-field
        v-if="isEditing"
        hide-details
        class="ma-0 pa-0 ml-4"
        :value="taskTitle"
        ref="task"
        @blur="editTask"
        @keydown.enter="editTask"
      ></v-text-field>
      <p
        v-else
        class="text-body-1 mb-0 ml-4"
        :class="status === 'done' && 'strikethrough'"
        @click="onTaskClick"
      >
        {{ taskTitle }}
      </p>
    </div>
    <div>
      <v-btn @click="removeTask" class="mx-2" fab x-small elevation="0">
        <v-icon>
          mdi-trash-can
        </v-icon>
      </v-btn>
      <v-icon class="handle" style="cursor: pointer;">
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
    taskTitle: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'pending'
    }
  },
  data() {
    return {
      isEditing: false
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
    },
    async changeTaskStatus(value) {
      await db
        .collection('boards')
        .doc(this.$route.params.id)
        .collection('list')
        .doc(this.id)
        .update({ status: value ? 'done' : 'pending' })
    },
    onTaskClick() {
      this.isEditing = true
      this.$nextTick(() => {
        this.$refs.task.focus()
      })
    },
    async editTask(e) {
      this.isEditing = false
      if (e.target.value !== this.taskTitle) {
        await db
          .collection('boards')
          .doc(this.$route.params.id)
          .collection('list')
          .doc(this.id)
          .update({ taskTitle: e.target.value })
      }
    }
  }
}
</script>

<style scoped>
.strikethrough {
  text-decoration: line-through;
}
</style>
