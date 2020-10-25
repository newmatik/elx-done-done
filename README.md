# done-done

## Deploy to Firebase Hosting
1. Create your Firebase project on their dashboard: https://console.firebase.google.com/

2. Install Firebase CLI globally
```
yarn global add firebase-tools
```

Make sure you are also logged in on Firebase via CLI
```
firebase login
```

3. Initialize Firebase project
```
firebase init
```

4. Select **Hosting** on the list of features
5. Select your Firebase project
6. Set public directory to `dist`
7. Select `yes` to configure project as an SPA
8. Build your Vue application
```
yarn build
```
9. Deploy your project to Firebase Hosting
```
firebase deploy --only hosting
```
10. URL will be given after deployment. Done!

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
