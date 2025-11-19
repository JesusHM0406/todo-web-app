// ============ GLOBAL VARIABLES ============ //

let todos = [];
let currentFilter = 'all';

// =========== SELECTORS =========== //

const taskCount = document.getElementById('taskCount');
const todoInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const deleteBtns = document.querySelectorAll('.delete-btn');
const clearBtn = document.getElementById('clearCompleted');
const container = document.querySelector('.content__todo-list');

function genereteId(){
  return Date.now();
};

function addTask(){
  const todoName = todoInput.value;

  if (todoName.trim() === '') return;

  if (typeof todoName !== 'string') return;

  const todoExists = todos.some(t => t.name === todoName.trim());

  if (todoExists) return;

  const newTodo = { id: genereteId(), name: todoName.trim(), isCompleted: false };

  todos.push(newTodo);

  todoInput.value = '';
};

function showTodos(){
  let todosHTML = '';

  todos.forEach(t =>{
    todosHTML += `
    <li class="content__todo-item">
      <input type="checkbox" name="taskCheckbox" class="task-checkbox" ${t.isCompleted ? 'checked' : ''}>
      <span class="todo__text">${t.name}</span>
      <button class="delete-btn">Delete</button>
    </li>
    `;
  });

  container.innerHTML = todosHTML;
};

addBtn.addEventListener('click', ()=>{
  addTask();
  showTodos();
});