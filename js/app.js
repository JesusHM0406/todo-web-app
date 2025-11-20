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

// =========== PRINCIPAL FUNCTIONS =========== //

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

  saveTodos();

  todoInput.value = '';
};

function showTodos(){
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();

  const filteredTodos = getFilteredTodos();

  filteredTodos.forEach(t =>{
    const liItem = document.createElement('li');
    liItem.classList.add('content__todo-item');

    liItem.innerHTML = `
      <input type="checkbox" name="taskCheckbox" class="task-checkbox" ${t.isCompleted ? 'checked' : ''}>
      <span class="todo__text">${t.name}</span>
      <button class="delete-btn">Delete</button>
    `;

    liItem.querySelector('.task-checkbox').addEventListener('click', ()=>{
      toggleTodo(t.id);
      showTodos();
    });

    fragment.appendChild(liItem);
  });

  container.appendChild(fragment);
};

function toggleTodo(id){
  const todo = todos.find(t => t.id === id);

  if (!todo) return;

  todo.isCompleted = !todo.isCompleted;

  saveTodos();
};

function getFilteredTodos(){
  if(currentFilter === 'active'){
    return todos.filter(t => t.isCompleted === false);
  }

  if(currentFilter === 'completed'){
    return todos.filter(t => t.isCompleted === true);
  }

  return todos;
};

// =========== PERSISTANCE FUNCTIONS =========== //

function saveTodos(){
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos(){
  try{
    const todosJSON = localStorage.getItem('todos');

    if(todosJSON){
      todos = JSON.parse(todosJSON);
    } else{
      todos = [];
    }
  } catch(e){
    todos = [];
  }

  if(!Array.isArray(todos)){
    todos = [];
  }
};

addBtn.addEventListener('click', ()=>{
  addTask();
  showTodos();
});

loadTodos();
showTodos();