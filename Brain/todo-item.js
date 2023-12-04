class TodoItem {
  constructor(title) {
    this.uid = Date.now();
    this.title = title;
    this.completed = false;
    this.color = "#ffffff";
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }

  setColor(newColor) {
    this.color = newColor;
  }

  setTitle(newTitle) {
    this.title = newTitle;
  }

  openEdit() {
    this.todoListItemView.style.display = "none";
    this.thistodoListItemEdit.style.display = "block";
    this.thistodoListItemEdit.value = this.todoListItemLabel.innerHTML;
  }

  editTodoListItemLabel(evt) {
    if (evt.key !== "Enter") return;
    this.todoListItemView.style.display = "block";
    this.todoListItemEdit.style.display = "none";
    this.todoListItemLabel.innerHTML = this.todoListItemEdit.value;
    saveToLocalStorage();
  }

  deleteTodoListItem() {
    this.todoListItem = document.getElementById(this.uid);
    this.todoListItem.remove();
    updateCounters();
    updateClearCompletedVisiblity();
    saveToLocalStorage();
  }

  updateTodoListItemBackgroundColor(evt) {
    this.todoListItem = document.getElementById(this.uid);
    this.color = evt.target.value;
    const invertedColor = invertHex(this.color);
    this.todoListItem.style.color = invertedColor;
    this.todoListItem.style.backgroundColor = this.color;
    saveToLocalStorage();
  }
}
