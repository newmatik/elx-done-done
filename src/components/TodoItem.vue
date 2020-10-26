<template>
  <v-card
    :color="status === 'done' ? 'blue-grey lighten-5' : ''"
    class="d-flex justify-space-between pa-4 mb-2"
    elevation="0"
    outlined
  >
    <div style="width: 80%" class="d-flex align-center">
      <div v-if="type !== 'headline'">
        <v-checkbox
          class="ma-0 pa-0"
          :input-value="status === 'done'"
          hide-details
          @change="changeTaskStatus"
        ></v-checkbox>
      </div>
      <div style="width: 100%">
        <v-text-field
          v-if="isEditing"
          hide-details
          class="ma-0 pa-0"
          :class="{
            'font-weight-black': type === 'headline',
            'ml-4': type === 'task'
          }"
          :value="taskTitle"
          ref="task"
          @blur="editTask"
          @keydown.enter="editTask"
        ></v-text-field>
        <p
          v-else
          class="text-body-1 mb-0"
          :class="{
            strikethrough: status === 'done',
            'font-weight-black': type === 'headline',
            'ml-4': type === 'task'
          }"
          @click="onTaskClick"
        >
          {{ taskTitle }}
        </p>
      </div>
    </div>
    <div class="d-flex align-center">
      <v-btn @click="dialog = true" class="mx-2" fab x-small elevation="0">
        <v-icon>
          mdi-trash-can
        </v-icon>
      </v-btn>
      <v-icon class="handle" style="cursor: pointer;">
        mdi-drag-vertical
      </v-icon>
    </div>

    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline red--text">
          Deleting {{ type }}...
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this {{ type }}? This action cannot be
          undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="red darken-1" dark @click="removeTask">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isEditing: false,
      dialog: false
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
        .set({ status: value ? 'done' : 'pending' }, { merge: true })
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
          .set({ taskTitle: e.target.value }, { merge: true })
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
