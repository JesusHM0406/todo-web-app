import { initializeUISelectors, showPendingTasks, showTodos } from "../../js/appUi.js";
import { loadTodos } from "../../js/todo.js";

const testsContainer = document.querySelector('.tests');

describe('showTodos', ()=>{
  beforeEach(()=>{
    testsContainer.innerHTML = `
      <span id="taskCount"></span>
      <div class="content__todo-list"></div>
    `;

    initializeUISelectors();
  });
  
  afterEach(()=>{
    testsContainer.innerHTML = '';
  });

  it('show the correct number of tasks based on the filter ("all")', ()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { id: '123', name: 'todo name', isCompleted: false },
      { id: '321', name: 'name todo', isCompleted: false }
    ]));
    loadTodos();

    showTodos('all');

    expect(document.querySelector('.content__todo-list').childElementCount).toEqual(2);
  });

  it('show the correct number of tasks based on the filter ("completed")', ()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { id: '123', name: 'todo name', isCompleted: false },
      { id: '321', name: 'name todo', isCompleted: false }
    ]));
    loadTodos();

    showTodos('completed');

    expect(document.querySelector('.content__todo-list').childElementCount).toEqual(1);
    expect(document.querySelector('.content__todo-list').textContent).toContain('There are no tasks with the "completed" filter.');
  });

  it('show the correct message if there are no tasks', ()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([]));
    loadTodos();

    showTodos('all');

    expect(document.querySelector('.content__todo-list').childElementCount).toEqual(1);
    expect(document.querySelector('.content__todo-list').textContent).toContain('The todo list is empty, please add a new task by clicking the add button.');
  });
});

describe('showPendingTasks', ()=>{
  beforeAll(()=>{
    testsContainer.innerHTML = `
    <span id="taskCount"></span>
    <div class="content__todo-list"></div>
  `;

    initializeUISelectors();

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { id: '123', name: 'todo name', isCompleted: false },
      { id: '321', name: 'name todo', isCompleted: false }
    ]));
    loadTodos();
  });

  it('shows the correct quantity on the page', ()=>{
    const counter = document.getElementById('taskCount');
  
    showPendingTasks();

    expect(counter.innerText).toEqual('2 pending tasks');
  });

  afterAll(()=>{
    testsContainer.innerHTML = '';
  });
});