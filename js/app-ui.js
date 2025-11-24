// =========== IMPORTS =========== //

import { todos, getFilteredTodos } from "./todo.js";
import { currentFilter } from "./events.js";

// =========== SELECTORS =========== //

let container = null;
let taskCount = null;

// =========== UI FUNCTIONS =========== //

export function showTodos(){
  if (todos.length === 0){
    container.innerHTML = `
      <li class="empty-todo">The todo list is empty, please add a new task by clicking the add button.</li>
    `;
    return;
  }

  container.innerHTML = '';

  const fragment = document.createDocumentFragment();

  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0){
    container.innerHTML = `
      <li class="empty-todo">There are no tasks with the "${currentFilter}" filter.</li>
    `;
    return;
  }

  filteredTodos.forEach(t =>{
    const { isCompleted, id, name } = t;

    const liItem = document.createElement('li');
    liItem.classList.add('content__todo-item');

    // All this is to clean the data and avoid problems with code injection
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.classList.add('task-checkbox');
    if (isCompleted) checkbox.setAttribute('checked', 'true');
    checkbox.dataset.id = id;

    const todoText = document.createElement('span');
    todoText.classList.add('todo__text');
    todoText.textContent = name;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.dataset.id = id;
    deleteBtn.textContent = 'Delete';
    
    liItem.appendChild(checkbox);
    liItem.appendChild(todoText);
    liItem.appendChild(deleteBtn);

    fragment.appendChild(liItem);
  });

  container.appendChild(fragment);
};

export function showPendingTasks(){
  const pendingTasks = todos.length;

  taskCount.textContent = `${pendingTasks} pending tasks`;
};

export function initializeUISelectors() {
  container = document.querySelector('.content__todo-list');
  taskCount = document.getElementById('taskCount');
};