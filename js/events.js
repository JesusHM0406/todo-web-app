// =========== IMPORTS =========== //

import { todoAPI } from "./todo.js";
import { showTodos, showPendingTasks } from "./appUi.js";
import { showNotification } from "./notifications.js";
import { toggleTheme } from "./theme.js";
import { currentFilter, setFilter } from "./filter.js";

// =========== SELECTORS =========== //

let todoInput = null;
let addBtn = null;
let filterBtns = null;
let filterContainer = null;
let clearBtn = null;
let togglerBtn = null;
let container = null;

// =========== FUNCTIONS =========== //

export function handleAddTask(
  createFunc = todoAPI.createTask,
  showFunc = showTodos, 
  showPendingFunc = showPendingTasks,
  showNotifFunc = showNotification
){
  const todoName = todoInput.value;

  try{
    createFunc(todoName);

    todoInput.value = '';
    showFunc(currentFilter);
    showPendingFunc();
    showNotifFunc('The task has been successfully added', 'success');
  } catch (e){
    showNotifFunc(e.message, 'error');
  }
};

export function handleDeleteClick(
  id, 
  deleteFunc = todoAPI.deleteTodo, 
  showFunc = showTodos, 
  showPendingFunc = showPendingTasks, 
  showNotifFunc = showNotification){
  const updated = deleteFunc(id);

  if (!updated) return;

  showFunc(currentFilter);
  showPendingFunc();
  showNotifFunc('The task has been deleted successfully', 'success');
};

export function handleClearTasksClick(
  clearFunc= todoAPI.clearTasks, 
  showFunc = showTodos, 
  showPendingFunc = showPendingTasks, 
  showNotifFunc = showNotification){
  const updated = clearFunc();

  if (!updated) return;

  showFunc(currentFilter);
  showPendingFunc();
  showNotifFunc('The completed tasks have been succesfully deleted', 'success');
};

export function handleToggleCompletedClick(
  id, 
  toggleFunc = todoAPI.toggleTodo, 
  showFunc = showTodos){
  const updated = toggleFunc(id);

  if (!updated) return;

  showFunc(currentFilter);
};

// =========== EVENT LISTENERS =========== //

export function atachEventListeners() {
  todoInput = document.getElementById('taskInput');
  addBtn = document.getElementById('addBtn');
  filterBtns = document.querySelectorAll('.filter-btn');
  filterContainer = document.querySelector('.content__filter');
  clearBtn = document.getElementById('clearCompleted');
  togglerBtn = document.getElementById('togglerBtn');
  container = document.querySelector('.content__todo-list');

  addBtn.addEventListener('click', () => {
    handleAddTask();
  });

  container.addEventListener('click', (e)=> {
    const target = e.target;
    const todoItem = target.closest('.content__todo-item');

    if (!todoItem) return;

    const todoId = target.dataset.id;

    if (!todoId) return;

    if(target.classList.contains('task-checkbox')){
      handleToggleCompletedClick(todoId);
    }
    else if (target.classList.contains('delete-btn')){
      handleDeleteClick(todoId);
    }
  });

  filterContainer.addEventListener('click', (e) => {
    const filterBtn = e.target.closest('.filter-btn');

    if (!filterBtn) return;

    const filter = filterBtn.dataset.filter;

    if (filter !== 'all' && filter !== 'active' && filter !== 'completed'){
      filter = 'all';
    }

    if(currentFilter === filter) return; // Avoid reloading as it is unnecessary

    setFilter(filter);

    filterBtns.forEach(btn => btn.classList.remove('active'));

    filterBtn.classList.add('active');

    showTodos(currentFilter);
  });

  todoInput.addEventListener('keypress', (e)=>{
    if (e.key === 'Enter'){
      handleAddTask();
    }
  });

  clearBtn.addEventListener('click', () => {
    handleClearTasksClick();
  });

  togglerBtn.addEventListener('click', ()=>{
    toggleTheme();
  });
};