/** обновляем значение поля completed у такого док-та */
function setCompleted(docId, value) {
    todoService.setCompleted(docId, value);
}

/** удаляем док-т */
function deleteDoc(docId) {
    todoService.deleteDoc(docId);
}

/** добавляем док-т */
function addData() {
    const titleEl = document.querySelector('#new_task');
    const title = titleEl.value;
    const docBody = {
        title: title,
        completed: false
    };
    todoService.addData(docBody);
    titleEl.value = "";
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

function subscribeForDataChanges() {
    const dataEl = document.querySelector('#data-ul');

    // эту функцию передадим как listener для изменений в базе
    const func = function (snapshot) {
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
    };

    todoService.subscribeOnTaskChanges(func);
}