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
  return String(Date.now());
};

function addTask(){
  const todoName = todoInput.value;

  if (todoName.trim() === '') {
    showNotification('Cannot add an empty task', 'error');
    return;
  }

  if (typeof todoName !== 'string') {
    showNotification('Please use text to add a task', 'error');
    return;
  }

  const todoExists = todos.some(t => t.name === todoName.trim());

  if (todoExists) {
    showNotification('There is already a task with that name', 'error');
    return;
  }

  const newTodo = { id: genereteId(), name: todoName.trim(), isCompleted: false };

  todos.push(newTodo);

  saveTodos();

  todoInput.value = '';


  showPendingTasks();
  showNotification('The task has been successfully added', 'success');
};

function removeTask(id){
  const taskExists = todos.some(t => t.id === id);

  if (!taskExists) return;

  todos = todos.filter(t => t.id !== id);

  saveTodos();

  showPendingTasks();
  showNotification('The task has been successfully deleted', 'success');
};

function clearTasks(){
  todos = todos.filter(t => t.isCompleted !== true);

  saveTodos();

  showPendingTasks();
  showNotification('The completed tasks have been succesfully deleted', 'success');
};

function showTodos(){
  container.innerHTML = '';

  const fragment = document.createDocumentFragment();

  const filteredTodos = getFilteredTodos();

  filteredTodos.forEach(t =>{
    const liItem = document.createElement('li');
    liItem.classList.add('content__todo-item');

    liItem.innerHTML = `
      <input type="checkbox" name="taskCheckbox" class="task-checkbox" ${t.isCompleted ? 'checked' : ''} data-id="${t.id}">
      <span class="todo__text">${t.name}</span>
      <button class="delete-btn" data-id="${t.id}">Delete</button>
    `;

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

function showPendingTasks(){
  const pendingTasks = todos.length;

  taskCount.textContent = `${pendingTasks} pending tasks`;
}

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

// =========== NOTIFICATION FUNCTION =========== //

const CONTAINER_ID = 'notification-stack-container';
const MAX_NOTIFICATIONS = 3;

function getNotificationsContainer(){
  let notifContainer = document.getElementById(CONTAINER_ID);

  if(!notifContainer){
    notifContainer = document.createElement('div');
    notifContainer.id = CONTAINER_ID;

    document.querySelector('.main').appendChild(notifContainer);
  }

  return notifContainer;
};

function closeNotification(notification){
  if (!notification) return;

  notification.classList.add('is-removing');

  notification.classList.remove('show');

  notification.addEventListener('transitionend', function handler(){
      notification.remove();

      notification.removeEventListener('transitionend', handler);

      const notifContainer = getNotificationsContainer();

      if (notifContainer.children.length === 0) {
        notifContainer.remove(); 
      }
    }, { once: true });
}

function showNotification(message, type){
  const notifContainer = getNotificationsContainer();
  const notifications = Array.from(notifContainer.children);
  const activeNotifications = notifications.filter(n => !n.classList.contains('is-removing'));

  if (notifications.length >= MAX_NOTIFICATIONS){
    const oldestNotification = activeNotifications[0];

    closeNotification(oldestNotification);
  };

  const notification = document.createElement('div');
  notification.classList.add('notification', type);

  setTimeout(()=>{
    notification.classList.add('show');
  }, 0);

  notification.innerHTML = `
    <span class="material-symbols-rounded">${type === 'success' ? 'check_circle' : 'dangerous'}</span>
    <span class="notification__text">${message}</span>
  `;

  notifContainer.appendChild(notification);

  setTimeout(()=>{
    closeNotification(notification);
  }, 5000);
};

// =========== EVENT LISTENERS =========== //

addBtn.addEventListener('click', ()=>{
  addTask();
  showTodos();
});

container.addEventListener('click', (e)=> {
  const target = e.target;
  const todoItem = target.closest('.content__todo-item');

  if (!todoItem) return;

  const todoId = target.dataset.id;

  if (!todoId) return;

  if(target.classList.contains('task-checkbox')){
    toggleTodo(todoId);
  }
  else if (target.classList.contains('delete-btn')){
    removeTask(todoId);
  }

  showTodos();
});

filterBtns.forEach(btn => {
  let filter = btn.dataset.filter;

  if (filter !== 'all' && filter !== 'active' && filter !== 'completed'){
    filter = 'all';
  }

  btn.addEventListener('click',()=>{
    if(currentFilter === filter) return; // Avoid reloading as it is unnecessary

    currentFilter = filter;

    filterBtns.forEach(btn => btn.classList.remove('active'));

    btn.classList.add('active');

    showTodos();
  });
});

todoInput.addEventListener('keypress', (e)=>{
  if (e.key === 'Enter'){
    addTask();
    showTodos();
  }
});

clearBtn.addEventListener('click', ()=>{
  clearTasks();
  showTodos();
});

// =========== INITIALIZATION =========== //

loadTodos();
showTodos();
showPendingTasks();