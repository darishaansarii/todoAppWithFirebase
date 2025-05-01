var firebaseConfig = {
  apiKey: "AIzaSyBv1RMd6ISIX6mNKEvuLuHNjy-9JDTDkZU",
  authDomain: "todoapp-fb3d2.firebaseapp.com",
  databaseURL: "https://todoapp-fb3d2-default-rtdb.firebaseio.com",
  projectId: "todoapp-fb3d2",
  storageBucket: "todoapp-fb3d2.firebasestorage.app",
  messagingSenderId: "438785217326",
  appId: "1:438785217326:web:33f215ad71e76e8c6160bf",
  measurementId: "G-PKB7CLMCZ2",
};

// Initialize Firebase
var app = firebase.initializeApp(firebaseConfig);

var task = document.getElementById("inpTask");
var ulElement = document.getElementById("task-list");

task.onkeydown = function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addTodo();
  }
};

firebase
  .database()
  .ref("todos")
  .on("child_added", function (data) {
    console.log(data.val());

    var btnDiv = document.createElement("div");
    btnDiv.setAttribute("class", "outer");

    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.className = "checkBox";
    checkBox.checked = false;
    checkBox.setAttribute("onclick", "toggleLine(this)");

    var liElement = document.createElement("li");
    var liTxtDiv = document.createElement("div");
    var liText = document.createTextNode(data.val().todo);
    liTxtDiv.appendChild(checkBox);
    liTxtDiv.appendChild(liText);
    liElement.appendChild(liTxtDiv);

    var delBtnElement = document.createElement("button");
    delBtnElement.setAttribute("class", "liBtn red");
    delBtnElement.setAttribute("id", data.val().id)
    delBtnElement.innerHTML = "<i class='fa-solid fa-trash'></i>";
    delBtnElement.setAttribute("onclick", "delSingleTodo(this)");

    var editBtnElement = document.createElement("button");
    editBtnElement.setAttribute("id", data.val().id)
    editBtnElement.setAttribute("class", "liBtn blue");
    editBtnElement.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";
    editBtnElement.setAttribute("onclick", "editSingleTodo(this)");

    btnDiv.appendChild(editBtnElement);
    btnDiv.appendChild(delBtnElement);

    liElement.appendChild(btnDiv);
    ulElement.appendChild(liElement);
  });

function addTodo() {
  try {
    if (task.value) {
      var id=firebase.database().ref("todos").push().key;
      var obj = {
        todo: task.value,
        id: id
      };
      firebase.database().ref(`todos/${id}`).set(obj);
      updateTaskCount();
      task.value = "";
    } else {
      alert("The task is required!");
    }
  } catch (error) {
    console.log(error);
  }
}

function editSingleTodo(e) {
  try {
    var li = e.parentNode.parentNode;
    var textDiv = li.firstChild;
    var checkBox = textDiv.firstChild;
    var textNode = checkBox.nextSibling;

    if (textNode.nodeType === 1 && textNode.tagName === "INPUT") {
      var input = textNode;
      var updatedText = document.createTextNode(input.value);

      var obj = {
        todo: input.value,
        id: e.id,
      };

      firebase.database().ref(`todos/${e.id}`).set(obj);
      
      textDiv.replaceChild(updatedText, input);
      e.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";

    } else {
      var currentText = textNode.nodeValue;

      var input = document.createElement("input");
      input.type = "text";
      input.value = currentText.trim();
      input.className = "edit-input";

      e.innerHTML = "<i class='fa-solid fa-check'></i>";

      input.onkeydown = function (eKey) {
        if (eKey.key === "Enter") {
          var updatedText = document.createTextNode(input.value);

          
          var obj = {
            todo: input.value,
            id: e.id,
          };

          firebase.database().ref(`todos/${e.id}`).set(obj);
          
          textDiv.replaceChild(updatedText, input);

          e.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";
          
        }
      };

      input.onblur = function () {
        var updatedText = document.createTextNode(input.value);

        var obj = {
          todo: input.value,
          id: e.id,
        };

        firebase.database().ref(`todos/${e.id}`).set(obj);

        textDiv.replaceChild(updatedText, input);
        e.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";
      };

      textDiv.replaceChild(input, textNode);
      input.focus();
    }
  } catch (error) {
    console.log(error);
  }
}

var count = 0;
function toggleLine(e) {
  var parentDiv = e.parentNode;
  if (e.checked) {
    parentDiv.classList.add("line-through");
    count++;
  } else {
    parentDiv.classList.remove("line-through");
    count--;
  }
  updateTaskCount();
}

function delSingleTodo(e) {
  try {        
    var li = e.parentNode.parentNode;
    var checkBox = li.firstChild.firstChild;

    if (checkBox.checked) {
      count--;
    }

    li.remove();
    firebase.database().ref(`todos/${e.id}`).remove();
    updateTaskCount();
  } catch (error) {
    console.log(error);
  }
}

function updateTaskCount() {
  var totalTasks = ulElement.children.length;
  numbers.innerHTML = `${count} / ${totalTasks}`;
}
