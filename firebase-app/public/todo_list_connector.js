var todoService = {
    initDb: function () {
        db = firebase.firestore();

        db.enablePersistence()
            .then(function () {
                return firebase.auth().signInAnonymously();
            })
            .then(function () {
                console.info("QQQ 11");
            }).catch(function (err) {
            console.log(err);
        });

        const callFunc = firebase.functions().httpsCallable('initCounter');

        callFunc()
            .then((result) => {
                console.info("init-counter result: ", result);
            });

        // найти максимальное значение id для task в базе

        // выставить counter в это значение

    },

    /** обновляем значение поля completed у такого док-та */
    setCompleted: function (docId, value) {
        const docRef = db.collection("todo_task").doc(docId);
        return docRef.update({
            completed: value
        }).then(function () {
            console.info("doc is updated, id: " + docId + ", completed: " + value);
        }).catch(function (error) {
            console.error("fail to update doc, id: " + docId, error);
        });
    },

    /** удаляем док-т */
    deleteDoc: function (docId) {
        const docRef = db.collection("todo_task").doc(docId);
        docRef.delete().then(function () {
            console.log("Document successfully deleted: " + docId);
        }).catch(function (error) {
            console.error("Error removing document: " + docId, error);
        });
    },

    addData: function (docBody) {
        //this.addDataViaDbApi(docBody);
        this.addDataViaFunction(docBody);
    },

    /** добавляем док-т используя db-Api*/
    addDataViaDbApi: function (docBody) {
        console.info("addData via db-Api: ", docBody);
        const checkedDocBody = { // ограничиваем документ только этими полями
            title: docBody.title,
            completed: docBody.completed
        };

        db.collection("todo_task")
            .add(checkedDocBody)
            .then(function (docRef) {
                console.info("Document is written with ID: ", docRef.id);
            }).catch(function (error) {
            console.error("Error adding doc: ", error)
        });
    },

    /** добавляем док-т, используя firebase-функцию */
    addDataViaFunction: function (docBody) {
        console.info("addData via function: ", docBody);

        const callFunc = firebase.functions().httpsCallable('addTask');
        const checkedDocBody = { // ограничиваем документ только этими полями
            title: docBody.title,
            completed: docBody.completed
        };

        callFunc(checkedDocBody)
            .then((result) => {
                console.info("add-data result: ", result);
            });
    },

    /** когда будет обновление Task -> будет вызван этот callbackFunc(snapshot) */
    subscribeOnTaskChanges: function (callbackFunc) {
        console.info("subscribe for changes on collection: todo_task");
        db.collection("todo_task")
            .onSnapshot(callbackFunc);
    }
};