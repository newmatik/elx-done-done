<template>
  <div class="home-page mx-auto d-flex justify-center align-center">
    <div style="width: 100%" class="d-flex flex-column">
      <div class="d-flex justify-center mb-6">
        <img height="50" src="images/DoneDoneLogo.svg" alt="Done Done Logo" />
      </div>
      <v-tabs v-model="tab" centered class="mb-4">
        <v-tab href="#create">Create board</v-tab>
        <v-tab href="#join">Join a board</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item value="create">
          <v-text-field
            v-model.trim="topic"
            outlined
            label="Type a topic for your board..."
            append-icon="mdi-plus-circle"
            :hint="hint"
            @keydown.enter="createBoard"
            @click:append="createBoard"
          ></v-text-field>
        </v-tab-item>
        <v-tab-item value="join">
          <v-text-field
            v-model.trim="boardName"
            outlined
            label="Type the board name to join..."
            append-icon="mdi-chevron-right-circle"
            @keydown.enter="joinBoard"
            @click:append="joinBoard"
          ></v-text-field>
        </v-tab-item>
      </v-tabs-items>
      <div v-if="boards.length > 0">
        <h6>Recent Boards</h6>
        <v-chip-group column>
          <v-chip v-for="board in boards" :key="board" :to="`/${board}`">
            {{ board }}
          </v-chip>
        </v-chip-group>
      </div>
    </div>

    <v-snackbar v-model="snackbar" timeout="2000">
      No board found.
    </v-snackbar>
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
      tab: 'create',
      topic: '',
      uniqueId: '',
      boards: [],
      selectedBoardId: '',
      boardName: '',
      snackbar: false
    }
  },
  created() {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10)
    this.uniqueId = nanoid()

    const jsonBoardList = localStorage.getItem('boards')
    if (jsonBoardList) {
      this.boards = JSON.parse(jsonBoardList)
    }
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
        this.saveBoardToLocalStorage(this.hint)
        this.$router.push(`/${this.hint}`)
      }
    },
    async joinBoard() {
      const snapshot = await db
        .collection('boards')
        .where('boardName', '==', this.boardName)
        .get()
      if (snapshot.docs.length > 0) {
        this.saveBoardToLocalStorage(this.boardName)
        this.$router.push(`/${this.boardName}`)
      } else {
        this.snackbar = true
      }
    },
    saveBoardToLocalStorage(boardName) {
      const jsonBoardList = localStorage.getItem('boards')
      if (jsonBoardList) {
        const boardList = JSON.parse(jsonBoardList)
        const isDuplicate = boardList.find(board => board === boardName)
        if (!isDuplicate) {
          boardList.push(boardName)
          localStorage.setItem('boards', JSON.stringify(boardList))
        }
      } else {
        localStorage.setItem('boards', JSON.stringify([boardName]))
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
