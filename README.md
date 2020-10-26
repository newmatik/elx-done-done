# done-done

## Deploy to Firebase Hosting
1. Create your Firebase project on their dashboard: https://console.firebase.google.com/

2. Set up your environment variables on a `.env` file with this format. You can get the credentials from the Firebase Dashboard on Project Settings after you create a Firebase App.
```
VUE_APP_FIREBASE_API_KEY=
VUE_APP_FIREBASE_DB_URL=
VUE_APP_FIREBASE_PROJECT_ID=
VUE_APP_FIREBASE_APP_ID=
```

3. Install Firebase CLI globally
```
yarn global add firebase-tools
```

Make sure you are also logged in on Firebase via CLI
```
firebase login
```

4. Initialize Firebase project
```
firebase init
```

5. Select **Hosting** on the list of features
6. Select your Firebase project
7. Set public directory to `dist`
8. Select `yes` to configure project as an SPA
9. Build your Vue application
```
yarn build
```
10. Deploy your project to Firebase Hosting
```
firebase deploy --only hosting
```
11. URL will be given after deployment. Done!

---

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
