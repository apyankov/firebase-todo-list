npm install -g firebase-tools

// ��� ����, ����� log in via the browser � authenticate the firebase tool
firebase login
firebase init
// ���� firebase init firestore
// � ����� firebase init functions

firebase deploy --only hosting:todo-list-dev

firebase serve

// ��������� ��������
firebase emulators:start --only firestore,functions,hosting