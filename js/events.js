// =========== IMPORTS =========== //

import { todoAPI } from "./todo.js";
import { showTodos, showPendingTasks } from "./app-ui.js";
import { showNotification } from "./notifications.js";
import { toggleTheme } from "./theme.js";

// =========== FILTER VARIABLE =========== //

export let currentFilter = 'all';

// =========== SELECTORS =========== //

let todoInput = null;
let addBtn = null;
let filterBtns = null;
let filterContainer = null;
let clearBtn = null;
let togglerBtn = null;
let container = null;

// =========== FUNCTIONS =========== //

export function setFilterForTest(filter){
  if(['all', 'active', 'completed'].includes(filter)){
    currentFilter = filter;
    return true;
  }

  return false;
};

export function handleAddTask(createFunc = todoAPI.createTask,
  showFunc = showTodos, 
  showPendingFunc = showPendingTasks,
  showNotifFunc = showNotification
){
  const todoName = todoInput.value;

  try{
    createFunc(todoName);

    todoInput.value = '';
    showFunc();
    showPendingFunc();
    showNotifFunc('The task has been successfully added', 'success');
  } catch (e){
    showNotifFunc(e.message, 'error');
  }
};

export function handleDeleteClick(id){
  const updated = todoAPI.deleteTodo(id);

  if (!updated) return;

  showTodos();
  showPendingTasks();
  showNotification('The task has been deleted successfully', 'success');
};

export function handleClearTasksClick(){
  const updated = todoAPI.clearTasks();

  if (!updated) return;

  showTodos();
  showPendingTasks();
  showNotification('The completed tasks have been succesfully deleted', 'success');
}

function handleToggleCompletedClick(id){
  const updated = todoAPI.toggleTodo(id);

  if (!updated) return;

  showTodos();
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

  addBtn.addEventListener('click', handleAddTask);

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
    const target = e.target;
    const filter = target.dataset.filter;

    if (!filter) return;

    if (filter !== 'all' && filter !== 'active' && filter !== 'completed'){
      filter = 'all';
    }

    if(currentFilter === filter) return; // Avoid reloading as it is unnecessary

    currentFilter = filter;

    filterBtns.forEach(btn => btn.classList.remove('active'));

    target.classList.add('active');

    showTodos();
  });

  todoInput.addEventListener('keypress', (e)=>{
    if (e.key === 'Enter'){
      handleAddTask();
    }
  });

  clearBtn.addEventListener('click', handleClearTasksClick);

  togglerBtn.addEventListener('click', ()=>{
    toggleTheme();
  });
};