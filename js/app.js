// ============ GLOBAL VARIABLES ============ //

let todos = [];
let currentFilter = 'all';
let currentTheme = 'light';

// =========== SELECTORS =========== //

const taskCount = document.getElementById('taskCount');
const todoInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const deleteBtns = document.querySelectorAll('.delete-btn');
const clearBtn = document.getElementById('clearCompleted');
const container = document.querySelector('.content__todo-list');
const togglerBtn = document.getElementById('togglerBtn');

// =========== PRINCIPAL FUNCTIONS =========== //

function generateId(){
  return String(Date.now());
};

function createTask(todoName){
  if (todoName.trim() === '') {
    throw new Error('Cannot add an empty task');
  }

  if (typeof todoName !== 'string') {
    throw new Error('Please use text to add a task');
  }

  const todoExists = todos.some(t => t.name === todoName.trim());

  if (todoExists) {
    throw new Error('There is already a task with that name');
  }

  const newTodo = { id: generateId(), name: todoName.trim(), isCompleted: false };

  todos.push(newTodo);
  saveTodos();
};

function handleAddTask(){
  const todoName = todoInput.value;

  try{
    createTask(todoName);

    todoInput.value = '';
    showTodos();
    showPendingTasks();
    showNotification('The task has been successfully added', 'success');
  } catch (e){
    showNotification(e.message, 'error');
  }
};

function deleteTodo(id){
  const taskExists = todos.some(t => t.id === id);

  if (!taskExists) return false;

  todos = todos.filter(t => t.id !== id);

  saveTodos();

  return true;
};

function handleDeleteClick(id){
  const updated = deleteTodo(id);

  if (!updated) return;

  showTodos();
  showPendingTasks();
  showNotification('The task has been deleted successfully', 'success');
};

function clearTasks(){
  const todoLength = todos.length;

  todos = todos.filter(t => t.isCompleted !== true);

  if (todoLength === todos.length) return;

  saveTodos();
  showPendingTasks();
  showNotification('The completed tasks have been succesfully deleted', 'success');
};

function showTodos(){
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

function toggleTodo(id){
  const todo = todos.find(t => t.id === id);

  if (!todo) return false;

  todo.isCompleted = !todo.isCompleted;

  saveTodos();

  return true;
};

function handleToggleCompletedClick(id){
  const updated = toggleTodo(id);

  if (!updated) return;

  showTodos();
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

// =========== TOGGLE THEME =========== //

function toggleTheme(){
  const icon = togglerBtn.querySelector('.material-symbols-rounded');
  
  if (currentTheme === 'light') {
    currentTheme = 'dark';
    
    document.body.classList.add('dark-mode');

    icon.classList.add('dark', 'transitioning');

    icon.addEventListener('transitionend', ()=>{
      icon.textContent = 'dark_mode';
      icon.classList.remove('transitioning');
    });
  }
  else {
    currentTheme = 'light';

    document.body.classList.remove('dark-mode');
  
    icon.classList.remove('dark');
    icon.classList.add( 'transitioning');

    icon.addEventListener('transitionend', ()=>{
      icon.textContent = 'light_mode';
      icon.classList.remove('transitioning');
    });
  }
}

// =========== EVENT LISTENERS =========== //

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
    handleAddTask();
  }
});

clearBtn.addEventListener('click', ()=>{
  const todoLength = todos.length;

  clearTasks();
  
  if (todoLength === todos.length) return;

  showTodos();
});

togglerBtn.addEventListener('click', ()=>{
  toggleTheme();
});

// =========== INITIALIZATION =========== //

loadTodos();
showTodos();
showPendingTasks();