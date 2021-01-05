npm install -g firebase-tools

// для того, чтобы log in via the browser и authenticate the firebase tool
firebase login
firebase init
// либо firebase init firestore
// а потом firebase init functions

firebase deploy --only hosting:todo-list-dev

firebase serve

// запускаем эмулятор
firebase emulators:start --only firestore,functions,hosting