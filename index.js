/*
 * Reference DOM elements
 */
const newTodoInput = document.querySelector("#newTodoInput");
const todoList = document.querySelector("#todoList");
const footer = document.querySelector(".footer");
const toggleAll = document.querySelector(".toggle-all");
const todoCount = document.querySelector(".todo-count").querySelector("strong");
const clearCompleted = document.querySelector(".clear-completed");
/*
 * id and counters
 */
let id = 0;
let itemCount = 0;
let complectedCount = 0;
/*
 *  TodoList logic
 */
function start() {
  if (todoList.children.length === 0) {
    footer.style.display = "none";
    toggleAll.style.display = "none";
    clearCompleted.style.display = "none";
  }
}

function addNewTodoFromInput(keydownEvent) {
  if (keydownEvent.key === "Enter" && newTodoInput.value) {
    footer.style.display = "flex";
    toggleAll.style.display = "block";
    todoCount.innerHTML = ++itemCount;
    createNewListItemFromValue(newTodoInput.value);
    updateClearCompletedVisiblity();
    newTodoInput.value = "";
  }
}

function createNewListItemFromValue(todoValue) {
  const item = document.createElement("li");
  item.id = id;
  item.innerHTML = `
     <div class="view">
         <input class="toggle"
                type="checkbox" onclick="checkTodoListItem(${id})"/>
         <label>${todoValue}</label>
         <input class="colorEdit" type="color" value="#ffffff" oninput="updateColor(event, ${id})"/>
         <button class="destroy" onclick="deleteTodoListItem(${id})"/>
     </div>
     <input class="edit"/>
`;
  id++;
  todoList.appendChild(item);
  let shadow = "0 1px 1px rgba(0, 0, 0, 0.2),";
  for (let i = 1; i <= itemCount; i++) {
    shadow += "0 " + 8 * i + "px 0 " + -3 * i + "px #f6f6f6,";
    shadow +=
      "0 " + 9 * i + "px " + i + "px " + -3 * i + "px rgba(0, 0, 0, 0.2),";
  }
  shadow = shadow.substring(0, shadow.length - 1);
  footer.style.setProperty("--box-shadow", shadow);
}

function invertHex(hex) {
  let newColor = (Number(`0x1${hex}`) ^ 0xffffff)
    .toString(16)
    .substring(1);
  newColor = "#" + newColor;
  return newColor;
}

function updateColor(evt, id) {
  const todoListItem = document.getElementById(id);
  const parsedColor = evt.target.value.substring(1, evt.target.value.length);
  const invertedColor = invertHex(parsedColor);
  todoListItem.style.color = invertedColor;
  todoListItem.style.backgroundColor = evt.target.value;
}

function deleteTodoListItem(id) {
  const todoListItem = document.getElementById(id);
  const todoListItemCheckbox = todoListItem.querySelector("input");
  if (todoListItemCheckbox.checked) {
    complectedCount--;
  } else {
    todoCount.innerHTML = --itemCount;
  }
  todoListItem.remove();
  updateClearCompletedVisiblity();
}

function clearComplectedTodoListItems() {
  let temp = [];
  for (let i = 0; i < todoList.children.length; i++) {
    const todoListItem = todoList.children[i];
    const todoListItemCheckbox = todoListItem.querySelector("input");
    if (todoListItemCheckbox.checked) {
      temp.push(todoListItem);
      complectedCount--;
    }
  }
  for (let i = 0; i < temp.length; i++) {
    const element = temp[i];
    element.remove();
  }
  updateClearCompletedVisiblity();
}

function checkTodoListItem(id) {
  const todoListItemCheckbox = document
    .getElementById(id)
    .querySelector("input");
  if (todoListItemCheckbox.checked) {
    todoCount.innerHTML = --itemCount;
    complectedCount++;
  } else {
    todoCount.innerHTML = ++itemCount;
    complectedCount--;
  }
  updateClearCompletedVisiblity();
}

function updateClearCompletedVisiblity() {
  if (complectedCount > 0) {
    clearCompleted.style.display = "block";
  } else {
    clearCompleted.style.display = "none";
  }
}

function toggleTodoListVisiblity() {
  if (todoList.style.display === "none") {
    todoList.style.display = "block";
  } else {
    todoList.style.display = "none";
  }
}

function updateCounters() {
  itemCount = 0;
  complectedCount = 0;
  for (let i = 0; i < todoList.children.length; i++) {
    const todoListItem = todoList.children[i];
    const todoListItemCheckbox = todoListItem.querySelector("input");
    todoListItem.style.display = "block";
    if (todoListItemCheckbox.checked) {
      complectedCount++;
    }
    itemCount++;
  }
  updateClearCompletedVisiblity();
}

function showAll() {
  for (let i = 0; i < todoList.children.length; i++) {
    const todoListItem = todoList.children[i];
    todoListItem.style.display = "block";
  }
  updateCounters();
  updateClearCompletedVisiblity();
}

function showActive() {
  for (let i = 0; i < todoList.children.length; i++) {
    const todoListItem = todoList.children[i];
    const todoListItemCheckbox = todoListItem.querySelector("input");
    if (!todoListItemCheckbox.checked) {
      todoListItem.style.display = "block";
    } else {
      todoListItem.style.display = "none";
    }
  }
  updateCounters();
  updateClearCompletedVisiblity();
}

function showCompleted() {
  for (let i = 0; i < todoList.children.length; i++) {
    const todoListItem = todoList.children[i];
    const todoListItemCheckbox = todoListItem.querySelector("input");
    if (todoListItemCheckbox.checked) {
      todoListItem.style.display = "block";
    } else {
      todoListItem.style.display = "none";
    }
  }
  updateCounters();
  updateClearCompletedVisiblity();
}

/*
 *  attach event listeners to dom elements
 */
newTodoInput.addEventListener("keydown", addNewTodoFromInput);

start();
