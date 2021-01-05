const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

var db = admin.firestore();

/** функции из get-started https://firebase.google.com/docs/functions/get-started?authuser=1 */
exports.addMessage = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
    const writeResult = await db.collection('messages').add({original: original});
    res.json({result: `Message with ID: ${writeResult.id} is added.`});
});

exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
        const original = snap.data().original;
        functions.logger.log('Uppercasing', context.params.documentId, original);
        const uppercase = original.toUpperCase();

        return snap.ref.set({uppercase}, {merge: true});
    });


/** функции для to-do-list-app */
/** добавить Task, с корректным next-id */
exports.addTask = functions.https.onCall(((data, context) => {
    console.info("firebase-function: addTask", data);

    const saveFunc = function (docId, docBody) {
        db.collection("todo_task")
            .doc(docId)
            .set(docBody)
            .then(function (docRef) {
                console.info("Document is set with ID: ", docId);
            }).catch(function (error) {
            console.error("Error adding task-doc: ", error)
        });
    };

    const counterDocRef = db.collection("id_counter").doc("todo_task");

    counterDocRef.get()
        .then(function (counterDoc) {
            if (counterDoc.exists) {
                const count = counterDoc.data().count;
                console.warn("count = ", counterDoc, count);
                saveCounter(count + 1);
                saveFunc("" + count, data);
            } else { // counter-doc не создан
                console.error("no counter-doc found");
            }
        })
        .catch(function (error) {
            console.error("Error getting counter-doc: ", error);
        })
    ;
}));


/** init для счетчика id-генератора */
exports.initCounter = functions.https.onCall(((data, context) => {
    console.info("init firebase-function: initCounter");

    provideMaxId((count) => {
        console.info("init with counter value: ", count);
        saveCounter(count);
    });
    return null;
}));

/** выставляем counter в это значение */
var saveCounter = function (count) {
    const counterDoc = {
        count: count
    };

    db.collection("id_counter")
        .doc("todo_task")
        .set(counterDoc)
        .then(function (docRef) {
            console.info("counterDoc is written with ID, value: ", docRef.id, counterDoc);
        }).catch(function (error) {
        console.error("Error adding counter-doc: ", error)
    });
};


/** находим максимальное значение id для существующих Task в базе */
var provideMaxId = function (callbackSetFunc) {
    db.collection("todo_task")
        .get()
        .then(function (querySnapshot) {
            let current = 1;
            querySnapshot.forEach(function (doc) {
                // console.info("find task.id: ", doc.id, current);
                if (typeof current === "undefined") {
                    // console.log("current is undefined");
                    current = parseInt(doc.id);
                } else if (parseInt(doc.id) > current) {
                    // console.log("now doc > current", doc.id);
                    current = parseInt(doc.id);
                } else {
                    // console.log("now doc < current", doc.id);
                }
            });
            callbackSetFunc(current + 1);
        });
};