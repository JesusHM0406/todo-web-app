export let todos = [];

// =========== PRINCIPAL FUNCTIONS =========== //

export function generateId(){
  return String(Date.now());
};

export function createTask(todoName){
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

export function deleteTodo(id){
  const taskExists = todos.some(t => t.id === id);

  if (!taskExists) return false;

  todos = todos.filter(t => t.id !== id);

  saveTodos();

  return true;
};

export function clearTasks(){
  const todoLength = todos.length;

  todos = todos.filter(t => t.isCompleted !== true);

  if (todoLength === todos.length) return false;

  saveTodos();

  return true;
};

export function toggleTodo(id){
  const todo = todos.find(t => t.id === id);

  if (!todo) return false;

  todo.isCompleted = !todo.isCompleted;

  saveTodos();

  return true;
};

export function getFilteredTodos(filter = 'all'){
  if(filter === 'active'){
    return todos.filter(t => t.isCompleted === false);
  }

  if(filter === 'completed'){
    return todos.filter(t => t.isCompleted === true);
  }

  return todos;
};

// =========== PERSISTANCE FUNCTIONS =========== //

export function saveTodos(){
  localStorage.setItem('todos', JSON.stringify(todos));
}

export function loadTodos(){
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

export const todoAPI = {
  generateId,
  createTask, 
  deleteTodo, 
  clearTasks, 
  toggleTodo, 
  getFilteredTodos, 
  saveTodos, 
  loadTodos
};