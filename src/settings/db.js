import firebase from 'firebase/app'
import 'firebase/firestore'

export const db = firebase
  .initializeApp({
    databaseURL: process.env.VUE_APP_FIREBASE_DB_URL,
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    projectId: `${process.env.VUE_APP_FIREBASE_PROJECT_ID}`,
    appId: process.env.VUE_APP_FIREBASE_APP_ID
  })
  .firestore()
