<template>
  <div class="home-page mx-auto d-flex justify-center align-center">
    <div style="width: 100%" class="d-flex flex-column">
      <div class="d-flex justify-center mb-6">
        <img height="50" src="images/DoneDoneLogo.svg" alt="Done Done Logo" />
      </div>
      <v-text-field
        v-model.trim="topic"
        outlined
        label="Type a topic for your board..."
        append-icon="mdi-plus-circle"
        :hint="hint"
        @keydown.enter="createBoard"
        @click:append="createBoard"
      ></v-text-field>
    </div>
  </div>
</template>

<script>
import { customAlphabet } from 'nanoid'
import kebabCase from 'lodash.kebabcase'
import { db } from '@/settings/db'

export default {
  name: 'Home',
  data() {
    return {
      topic: '',
      uniqueId: ''
    }
  },
  created() {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10)
    this.uniqueId = nanoid()
  },
  computed: {
    hint() {
      return this.topic ? `${kebabCase(this.topic)}-${this.uniqueId}` : ''
    }
  },
  methods: {
    async createBoard() {
      if (this.topic) {
        await db
          .collection('boards')
          .doc(this.hint)
          .set({
            boardName: this.hint
          })
        await db
          .collection('boards')
          .doc(this.hint)
          .collection('list')
          .add({
            taskTitle: 'Welcome to your board!',
            status: 'pending',
            order: 1,
            type: 'task'
          })
        this.$router.push(`/${this.hint}`)
      }
    }
  }
}
</script>

<style scoped>
.home-page {
  max-width: 720px;
  height: 100vh;
}

@media (max-width: 640px) {
  .home-page {
    padding: 0 1rem;
  }
}
</style>
