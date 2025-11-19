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

addBtn.addEventListener('click',addTask);