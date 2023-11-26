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
let itemsLS = [];
/*
 *  TodoList logic
 */
function start() {
  if (todoList.children.length === 0) {
    footer.style.display = "none";
    toggleAll.style.display = "none";
    clearCompleted.style.display = "none";
  }
  loadFromLocalStorage();
}

function addNewTodoFromInput(keydownEvent) {
  if (keydownEvent.key === "Enter" && newTodoInput.value) {
    if (checkIfItemNameExists(newTodoInput.value)) {
      alert("Item allready exists!");
      return;
    }
    footer.style.display = "flex";
    toggleAll.style.display = "block";
    todoCount.innerHTML = ++itemCount;
    createNewListItemFromValue(newTodoInput.value);
    updateClearCompletedVisiblity();
    itemsLS.push({
      name: newTodoInput.value,
      checked: false,
      color: "#ffffff",
    });
    saveToLocalStorage();
    newTodoInput.value = "";
    addShadowToFooter();
  }
}

function createNewListItemFromValue(todoValue) {
  const item = document.createElement("li");
  item.id = id;
  item.innerHTML = `
     <div class="view" ondblclick="toggleToDoListItemEdit(${id})">
         <input class="toggle"
                type="checkbox" onclick="checkTodoListItem(${id})"/>
         <label>${todoValue}</label>
         <input class="colorEdit" type="color" value="#ffffff" oninput="updateTodoListItemBackgroundColor(event, ${id})"/>
         <button class="destroy" onclick="deleteTodoListItem(${id})"/>
     </div>
     <input class="edit" onkeydown="editTodoListItemLabel(event, ${id})"/>
`;
  id++;
  todoList.appendChild(item);
  return item;
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

function editTodoListItemLabel(evt, id) {
  if (evt.key !== "Enter") return;
  const todoListItem = document.getElementById(id);
  const todoListItemView = todoListItem.querySelector(".view");
  const todoListItemEdit = todoListItem.querySelector(".edit");
  const todoListItemLabel = todoListItem.querySelector("label");
  if (checkIfItemNameExists(todoListItemEdit.value)) {
    alert("Item allready exists!");
    return;
  }
  todoListItemView.style.display = "block";
  todoListItemEdit.style.display = "none";
  itemsLS.forEach((item) => {
    if (item.name === todoListItemLabel.innerHTML) {
      item.name = todoListItemEdit.value;
    }
  });
  saveToLocalStorage();
  todoListItemLabel.innerHTML = todoListItemEdit.value;
}

function addShadowToFooter() {
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
  let newColor = (Number(`0x1${hex}`) ^ 0xffffff).toString(16).substring(1);
  newColor = "#" + newColor;
  return newColor;
}

function updateTodoListItemBackgroundColor(evt, id) {
  const todoListItem = document.getElementById(id);
  const todoListItemLabel = todoListItem.querySelector('label');
  const parsedColor = evt.target.value.substring(1, evt.target.value.length);
  const invertedColor = invertHex(parsedColor);
  todoListItem.style.color = invertedColor;
  todoListItem.style.backgroundColor = evt.target.value;
  itemsLS.forEach((item) => {
    if (item.name === todoListItemLabel.innerHTML) {
      item.color = evt.target.value;
    }
  });
  saveToLocalStorage();
}

function deleteTodoListItem(id) {
  const todoListItem = document.getElementById(id);
  const todoListItemLabel = todoListItem.querySelector("label");
  const todoListItemCheckbox = todoListItem.querySelector("input");
  if (todoListItemCheckbox.checked) {
    complectedCount--;
  } else {
    todoCount.innerHTML = --itemCount;
  }
  itemsLS.forEach((item, index) => {
    if (item.name === todoListItemLabel.innerHTML) {
      itemsLS.splice(index, 1);
    }
  });
  saveToLocalStorage();
  todoListItem.remove();
  updateClearCompletedVisiblity();
  addShadowToFooter();
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
    const todoListItemLabel = element.querySelector("label");
    itemsLS.forEach((item, index) => {
      if (item.name === todoListItemLabel.innerHTML) {
        itemsLS.splice(index, 1);
      }
    });
    saveToLocalStorage();
    element.remove();
  }
  updateClearCompletedVisiblity();
  addShadowToFooter();
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
  itemsLS.forEach((item) => {
    if (item.name === todoListItemLabel.innerHTML) {
      item.checked = todoListItemCheckbox.checked
    }
  });
  saveToLocalStorage();
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

function checkIfItemNameExists(name) {
  for (let i = 0; i < todoList.children.length; i++) {
    const todoListItem = todoList.children[i];
    const todoListItemLabel = todoListItem.querySelector("label");
    if (todoListItemLabel.innerHTML === name) {
      return true;
    }
  }
  return false;
}

function updateCounters() {
  itemCount = 0;
  complectedCount = 0;
  for (let i = 0; i < todoList.children.length; i++) {
    const todoListItem = todoList.children[i];
    const todoListItemCheckbox = todoListItem.querySelector("input");
    if (todoListItemCheckbox.checked) {
      complectedCount++;
    }
    itemCount++;
  }
}

function showAll() {
  for (let i = 0; i < todoList.children.length; i++) {
    const todoListItem = todoList.children[i];
    todoListItem.style.display = "block";
  }
  updateCounters();
  updateClearCompletedVisiblity();
  addShadowToFooter();
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
  addShadowToFooter();
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
  addShadowToFooter();
}

function saveToLocalStorage() {
  localStorage.setItem('todoListItems', JSON.stringify(itemsLS));
}

function loadFromLocalStorage() {
  const localStorageItemsData = localStorage.getItem('todoListItems');
  if (localStorageItemsData) {
    const localStorageItemsDataParsed = JSON.parse(localStorageItemsData);
    itemsLS = localStorageItemsDataParsed;
    footer.style.display = "flex";
    toggleAll.style.display = "block";
    for (let i = 0; i < itemsLS.length; i++) {
      const itemLS = itemsLS[i];
      const todoListItemAdded = createNewListItemFromValue(itemLS.name);
      // update color and checked
      todoListItemAdded.querySelector('input').checked = itemLS.checked;
      const color = itemLS.color;
      const invertedColor = invertHex(color);
      todoListItemAdded.style.color = invertedColor;
      todoListItemAdded.style.backgroundColor = color;
      // ---------------
      todoCount.innerHTML = ++itemCount;
      addShadowToFooter();
    }
    updateClearCompletedVisiblity();
  }
}

/*
 *  attach event listeners to dom elements
 */
newTodoInput.addEventListener("keydown", addNewTodoFromInput);

start();
