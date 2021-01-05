function initDb() {
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
}

/** обновляем значение поля completed у такого док-та */
function setCompleted(docId, value) {
    const docRef = db.collection("todo_task").doc(docId);
    return docRef.update({
        completed: value
    }).then(function () {
        console.info("doc is updated, id: " + docId + ", completed: " + value);
    }).catch(function (error) {
        console.error("fail to update doc, id: " + docId, error);
    });
}

/** удаляем док-т */
function deleteDoc(docId) {
    const docRef = db.collection("todo_task").doc(docId);
    docRef.delete().then(function () {
        console.log("Document successfully deleted: " + docId);
    }).catch(function (error) {
        console.error("Error removing document: " + docId, error);
    });
}

/** добавляем док-т */
function addData() {
    const titleEl = document.querySelector('#new_task');
    const title = titleEl.value;
    console.info("value = " + title);
    db.collection("todo_task").add({
        title: title,
        completed: false
    }).then(function (docRef) {
        console.info("Document is written with ID: ", docRef.id);
        titleEl.value = "";
    }).catch(function (error) {
        console.error("Error adding doc: ", error)
    });
}

/** id html-элемента <li/> для документа с таким id */
function elementIdOf(docId) {
    return "doc-id-" + docId;
}

/** содержимое html-элемента <li/> для док-та */
function elementContentOf(docId, docData) {
    const span = document.createElement("span");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = docData.completed;
    checkbox.addEventListener('click', function (event) {
        setCompleted(docId, !docData.completed);
        event.stopPropagation();
        return false;
    });
    const nestedSpan = document.createElement("span");
    if (docData.completed) {
        nestedSpan.style.cssText = 'text-decoration: line-through';
    }
    const text = document.createTextNode(`${docId} | ${docData.title} | ${docData.completed}`);
    const img = document.createElement("img");
    img.setAttribute("src", "./delete-icon.png");
    img.addEventListener('click', function (event) {
        deleteDoc(docId);
        event.stopPropagation();
        return false;
    });
    nestedSpan.appendChild(text);
    nestedSpan.appendChild(img);
    span.appendChild(checkbox);
    span.appendChild(nestedSpan);
    return span;
}

/** содержимое элемента для такого док-та */
function elementOf(docId, docData) {
    const li = document.createElement("li");
    const elemId = elementIdOf(docId);
    li.setAttribute("id", elemId);
    li.appendChild(elementContentOf(docId, docData));
    return li;
}

/** находим элемент <li /> для док-та с таким id*/
function findElementOf(docId) {
    return document.querySelector('#' + elementIdOf(docId));
}

function loadData() {
    console.info("QQQ 1 do load data");
    const dataEl = document.querySelector('#data-ul');

    // db.collection("todo_task").get().then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         const li = document.createElement("li");
    //         const data = doc.data();
    //         li.appendChild(document.createTextNode(`${doc.id} | ${data.title} | ${data.completed}`));
    //         dataEl.appendChild(li);
    //         console.info(`add element: ${doc.id} => ${doc.data().title}, ${doc.data().completed}`);
    //     });
    // });

    db.collection("todo_task")
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {
                if (change.type === "added") { // добавили
                    const li = elementOf(change.doc.id, change.doc.data());
                    dataEl.appendChild(li);
                    console.log("New city: ", change.doc.data());
                } else if (change.type === "modified") { // изменили
                    const li = findElementOf(change.doc.id);
                    while (li.firstChild) {
                        li.removeChild(li.firstChild);
                    }
                    li.appendChild(elementContentOf(change.doc.id, change.doc.data()));

                    console.log("Modified city: ", change.doc.data());
                } else if (change.type === "removed") { // удалили
                    const li = findElementOf(change.doc.id);
                    li.remove();
                    console.log("Removed city: ", change.doc.data());
                } else { // что-то пока не обрабатываем
                    console.log("unknown modify-type: " + change.type);
                }
            });
            // snapshot.forEach(function (doc) {
            //     debugger;
            //     console.info("doc: " + doc);
            // });
        });
}