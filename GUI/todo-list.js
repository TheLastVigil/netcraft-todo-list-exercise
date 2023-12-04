/*
 * Reference DOM elements
 */
const newTodoInput = document.querySelector("#newTodoInput");
const todoListElement = document.querySelector("#todoList");
const footer = document.querySelector(".footer");
const toggleAll = document.querySelector(".toggle-all");
const todoCount = document.querySelector(".todo-count").querySelector("strong");
const clearCompleted = document.querySelector(".clear-completed");
/*
 * variables
 */
const todoList = [];
let itemCount = 0;
let complectedCount = 0;

function updateClearCompletedVisiblity() {
  complectedCount > 0
    ? (clearCompleted.style.display = "block")
    : (clearCompleted.style.display = "none");
}

function toggleTodoListVisiblity() {
  todoList.style.display === "none"
    ? (todoList.style.display = "block")
    : (todoList.style.display = "none");
}

function showAll() {
  resetCounters();
  todoListElement.childNodes.forEach((todoItem) => {
    todoItem.style.display = "block";
    itemCount++;
    if (todoItemCheckbox.checked) {
      complectedCount++;
    }
  });
  shadowFooter();
  updateClearCompletedVisiblity();
}

function showActive() {
  resetCounters();
  todoListElement.childNodes.forEach((todoItem) => {
    const todoItemCheckbox = todoItem.querySelector("input");
    if (!todoItemCheckbox.checked) {
      todoItem.style.display = "block";
      itemCount++;
    } else {
      todoItem.style.display = "none";
    }
  });
  shadowFooter();
  updateClearCompletedVisiblity();
}

function showCompleted() {
  resetCounters();
  todoListElement.childNodes.forEach((todoItem) => {
    const todoItemCheckbox = todoItem.querySelector("input");
    if (todoItemCheckbox.checked) {
      todoItem.style.display = "block";
      itemCount++;
      complectedCount++;
    } else {
      todoItem.style.display = "none";
    }
  });
  shadowFooter();
  updateClearCompletedVisiblity();
}

function invertHex(hex) {
  const parsedColor = hex.substring(1, hex.length);
  let newColor = (Number(`0x1${parsedColor}`) ^ 0xffffff)
    .toString(16)
    .substring(1);
  newColor = "#" + newColor;
  return newColor;
}

function resetCounters() {
  itemCount = 0;
  complectedCount = 0;
}

function saveToLocalStorage() {
  localStorage.setItem("todoListItems", JSON.stringify(todoList));
}

function loadFromLocalStorage() {
  const localStorageItemsData = localStorage.getItem("todoListItems");
  if (localStorageItemsData) {
    const localStorageItemsDataParsed = JSON.parse(localStorageItemsData);
    todoList = localStorageItemsDataParsed;
    footer.style.display = "flex";
    toggleAll.style.display = "block";
    todoList.forEach((todoItem) => {
      const todoListItemAdded = createNewListItemFromValue(todoItem.name);
      // update color and checked
      todoListItemAdded.querySelector("input").checked = todoItem.checked;
      const color = todoItem.color;
      const invertedColor = invertHex(color);
      todoListItemAdded.style.color = invertedColor;
      todoListItemAdded.style.backgroundColor = color;
      // ---------------
      todoCount.innerHTML = ++itemCount;
      shadowFooter();
    });
    updateClearCompletedVisiblity();
  }
}

function editTodoListItemLabel(evt, id) {
  if (evt.key !== "Enter") return;
  const todoListItem = document.getElementById(id);
  const todoListItemView = todoListItem.querySelector(".view");
  const todoListItemEdit = todoListItem.querySelector(".edit");
  const todoListItemLabel = todoListItem.querySelector("label");
  todoListItemView.style.display = "block";
  todoListItemEdit.style.display = "none";
  const editedTodoItem = todoList.find(
    (item) => item.name === todoListItemLabel.innerHTML
  );
  editedTodoItem.name = todoListItemEdit.value;
  saveToLocalStorage();
  todoListItemLabel.innerHTML = todoListItemEdit.value;
}

function toggleToDoListItemEdit(id) {
  const todoListItem = document.getElementById(id);
  const todoListItemView = todoListItem.querySelector(".view");
  const todoListItemEdit = todoListItem.querySelector(".edit");
  const todoListItemLabel = todoListItem.querySelector("label");
  todoListItemView.style.display = "none";
  todoListItemEdit.style.display = "block";
  todoListItemEdit.value = todoListItemLabel.innerHTML;
}

function deleteTodoListItem(id) {
  const todoListItem = document.getElementById(id);
  const todoListItemLabel = todoListItem.querySelector("label");
  const todoListItemCheckbox = todoListItem.querySelector("input");
  todoListItemCheckbox.checked
    ? complectedCount--
    : (todoCount.innerHTML = --itemCount);
  const indexToDelete = todoList.findIndex(
    (item) => item.name === todoListItemLabel.innerHTML
  );
  todoList.splice(indexToDelete, 1);
  todoListItem.remove();
  saveToLocalStorage();
  updateClearCompletedVisiblity();
}

function clearComplectedTodoListItems() {
  let temp = [];
  todoList.forEach((item) => {
    const todoListItemCheckbox = item.querySelector("input");
    if (todoListItemCheckbox.checked) {
      temp.push(item);
      complectedCount--;
    }
  });
  temp.forEach((tempItem) => {
    const todoListItemLabel = tempItem.querySelector("label");
    todoList.forEach((item, index) => {
      if (item.name === todoListItemLabel.innerHTML) {
        todoList.splice(index, 1);
      }
    });
    tempItem.remove();
    saveToLocalStorage();
  });
  updateClearCompletedVisiblity();
  shadowFooter();
}

function updateTodoListItemBackgroundColor(evt, id) {
  const todoListItem = document.getElementById(id);
  const todoListItemLabel = todoListItem.querySelector("label");
  const parsedColor = evt.target.value.substring(1, evt.target.value.length);
  const invertedColor = invertHex(parsedColor);
  todoListItem.style.color = invertedColor;
  todoListItem.style.backgroundColor = evt.target.value;
  const foundTodoItem = todoList.find(
    (item) => item.name === todoListItemLabel.innerHTML
  );
  foundTodoItem.color = evt.target.value;
  saveToLocalStorage();
}

function checkTodoListItem(id) {
  const todoListItem = document.getElementById(id);
  const todoListItemCheckbox = todoListItem.querySelector("input");
  const todoListItemLabel = todoListItem.querySelector("label");
  if (todoListItemCheckbox.checked) {
    todoCount.innerHTML = --itemCount;
    complectedCount++;
  } else {
    todoCount.innerHTML = ++itemCount;
    complectedCount--;
  }
  const foundTodoItem = todoList.find(
    (item) => item.name === todoListItemLabel.innerHTML
  );
  foundTodoItem.checked = todoListItemCheckbox.checked;
  saveToLocalStorage();
  updateClearCompletedVisiblity();
}

function drawTodoList() {
  todoListElement.innerHTML = "";
  todoList.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `    
        <div class="view" ondblclick="item.openEdit()">
            <input class="toggle"
                   type="checkbox" onclick="item.toggleCompleted()"/>
            <label>${item.title}</label>
            <input class="colorEdit" type="color" value="#ffffff" oninput="item.updateTodoListItemBackgroundColor(event)"/>
            <button class="destroy" onclick="item.deleteTodoListItem()"/>
        </div>
        <input class="edit" onkeydown="item.editTodoListItemLabel(event)"/>
   `;
    todoListElement.appendChild(li);
  });
}

function addNewTodoItemFromInput(keydownEvent) {
  if (keydownEvent.key === "Enter" && newTodoInput.value) {
    todoList.push(new TodoItem(newTodoInput.value));
    drawTodoList();
    newTodoInput.value = "";
    todoCount.innerHTML = ++itemCount;
    footer.style.display = "flex";
    toggleAll.style.display = "block";
    updateClearCompletedVisiblity();
    saveToLocalStorage();
    shadowFooter();
  }
}

function shadowFooter() {
  let shadow = "0 1px 1px rgba(0, 0, 0, 0.2),";
  for (let i = 1; i <= itemCount; i++) {
    shadow += "0 " + 8 * i + "px 0 " + -3 * i + "px #f6f6f6,";
    shadow +=
      "0 " + 9 * i + "px " + i + "px " + -3 * i + "px rgba(0, 0, 0, 0.2),";
  }
  shadow = shadow.substring(0, shadow.length - 1);
  footer.style.setProperty("--box-shadow", shadow);
}

function start() {
  footer.style.display = "none";
  toggleAll.style.display = "none";
  clearCompleted.style.display = "none";
  //   loadFromLocalStorage();
}
/*
 *  attach event listeners to dom elements
 */
newTodoInput.addEventListener("keydown", addNewTodoItemFromInput);

start();
