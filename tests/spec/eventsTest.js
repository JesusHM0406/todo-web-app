import { initializeUISelectors } from "../../js/appUi.js";
import { atachEventListeners, handleAddTask, handleClearTasksClick, handleDeleteClick, handleToggleCompletedClick } from "../../js/events.js";
import { loadTodos} from "../../js/todo.js";
import { currentFilter } from "../../js/filter.js";

const testsContainer = document.querySelector('.tests');

describe('handleAddTask', ()=>{
  let createFunc, showFunc, showPendingFunc, showNotifFunc;
  const testsContainer = document.querySelector('.tests');

  testsContainer.innerHTML = `
    <input type="text" id="taskInput" value="New Task">
    <button id="addBtn"></button>
    <div class="content__filter">
      <button class="filter-btn"></button>
    </div>
    <button id="clearCompleted"></button>
    <button id="togglerBtn"></button>
    <div class="content__todo-list"></div>
  `;

  atachEventListeners();

  beforeEach(()=>{
    createFunc = jasmine.createSpy('createFunc');
    showFunc = jasmine.createSpy('showFunc');
    showPendingFunc = jasmine.createSpy('showPendingFunc');
    showNotifFunc = jasmine.createSpy('showNotifFunc');
  });

  it('call the Logic and View functions after the task is successfully created.', ()=>{
    handleAddTask(createFunc, showFunc, showPendingFunc, showNotifFunc);

    expect(createFunc).toHaveBeenCalledTimes(1);
    expect(createFunc).toHaveBeenCalledWith('New Task');
    expect(showFunc).toHaveBeenCalledTimes(1);
    expect(showPendingFunc).toHaveBeenCalledTimes(1);
    expect(showNotifFunc).toHaveBeenCalledTimes(1);
    expect(showNotifFunc).toHaveBeenCalledWith('The task has been successfully added', 'success');
  });

  it('call notification and NOT call view functions if logic fails', ()=>{
    createFunc.and.throwError('There is already a task with that name');
    
    handleAddTask(createFunc, showFunc, showPendingFunc, showNotifFunc);

    expect(createFunc).toHaveBeenCalledTimes(1);
    expect(showFunc).not.toHaveBeenCalled();
    expect(showPendingFunc).not.toHaveBeenCalled();
    expect(showNotifFunc).toHaveBeenCalledTimes(1);
    expect(showNotifFunc).toHaveBeenCalledWith('There is already a task with that name', 'error');
  });

  afterAll(()=>{
    testsContainer.innerHTML = '';
  });
});

describe('handleDeleteClick', ()=>{
  let deleteFunc, showFunc, showPendingFunc, showNotifFunc;

  beforeEach(()=>{
    deleteFunc = jasmine.createSpy('deleteFunc');
    showFunc = jasmine.createSpy('showFunc');
    showPendingFunc = jasmine.createSpy('showPendingFunc');
    showNotifFunc = jasmine.createSpy('showNotifFunc');
  });

  it('call the Logic and View functions after the task is successfully deleted', ()=>{
    deleteFunc.and.returnValue(true);

    handleDeleteClick('123', deleteFunc, showFunc, showPendingFunc, showNotifFunc);

    expect(deleteFunc).toHaveBeenCalledTimes(1);
    expect(deleteFunc).toHaveBeenCalledWith('123');
    expect(showFunc).toHaveBeenCalledTimes(1);
    expect(showPendingFunc).toHaveBeenCalledTimes(1);
    expect(showNotifFunc).toHaveBeenCalledTimes(1);
    expect(showNotifFunc).toHaveBeenCalledWith('The task has been deleted successfully', 'success');
  });

  it('do nothing if logic fails', ()=>{
    deleteFunc.and.returnValue(false);
    
    handleDeleteClick('123', deleteFunc, showFunc, showPendingFunc, showNotifFunc);

    expect(deleteFunc).toHaveBeenCalledTimes(1);
    expect(showFunc).not.toHaveBeenCalled();
    expect(showPendingFunc).not.toHaveBeenCalled();
    expect(showNotifFunc).not.toHaveBeenCalled();
  });
});

describe('handleClearTasksClick', ()=>{
  let clearFunc, showFunc, showPendingFunc, showNotifFunc;

  beforeEach(()=>{
    clearFunc = jasmine.createSpy('clearFunc');
    showFunc = jasmine.createSpy('showFunc');
    showPendingFunc = jasmine.createSpy('showPendingFunc');
    showNotifFunc = jasmine.createSpy('showNotifFunc');
  });

  it('call the Logic and View functions after the completed task are successfully deleted', ()=>{
    clearFunc.and.returnValue(true);

    handleClearTasksClick(clearFunc, showFunc, showPendingFunc, showNotifFunc);

    expect(clearFunc).toHaveBeenCalledTimes(1);
    expect(showFunc).toHaveBeenCalledTimes(1);
    expect(showPendingFunc).toHaveBeenCalledTimes(1);
    expect(showNotifFunc).toHaveBeenCalledTimes(1);
    expect(showNotifFunc).toHaveBeenCalledWith('The completed tasks have been succesfully deleted', 'success');
  });

  it('do nothing if logic fails', ()=>{
    clearFunc.and.returnValue(false);
    
    handleClearTasksClick(clearFunc, showFunc, showPendingFunc, showNotifFunc);

    expect(clearFunc).toHaveBeenCalledTimes(1);
    expect(showFunc).not.toHaveBeenCalled();
    expect(showPendingFunc).not.toHaveBeenCalled();
    expect(showNotifFunc).not.toHaveBeenCalled();
  });
});

describe('handleToggleCompletedClick', ()=>{
  let toggleFunc, showFunc;

  beforeEach(()=>{
    toggleFunc = jasmine.createSpy('toggleFunc');
    showFunc = jasmine.createSpy('showFunc');
  });

  it('call the Logic and View functions after the task is successfully deleted', ()=>{
    toggleFunc.and.returnValue(true);

    handleToggleCompletedClick('123', toggleFunc, showFunc);

    expect(toggleFunc).toHaveBeenCalledTimes(1);
    expect(toggleFunc).toHaveBeenCalledWith('123');
    expect(showFunc).toHaveBeenCalledTimes(1);
  });

  it('do nothing if logic fails', ()=>{
    toggleFunc.and.returnValue(false);
    
    handleToggleCompletedClick('123', toggleFunc, showFunc);

    expect(toggleFunc).toHaveBeenCalledTimes(1);
    expect(showFunc).not.toHaveBeenCalled();
  });
});

describe('filterEvents', ()=>{
  const testsContainer = document.querySelector('.tests');

  beforeAll(()=>{
    testsContainer.innerHTML = `
      <div id="taskCount"></div>
      <input type="text" id="taskInput" value="New Task">
      <button id="addBtn"></button>
      <div class="content__filter">
        <button class="filter-btn active" data-filter="all"></button>
        <button class="filter-btn" data-filter="active"></button>
        <button class="filter-btn" data-filter="completed"></button>
      </div>
      <button id="clearCompleted"></button>
      <button id="togglerBtn"></button>
      <div class="content__todo-list"></div>
    `;

    atachEventListeners();
    initializeUISelectors()

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { id: '123', name: 'todo name', isCompleted: false },
      { id: '321', name: 'name todo', isCompleted: false },
      { id: '456', name: 'new todo', isCompleted: false },
      { id: '654', name: 'todo new', isCompleted: true },
    ]));
    loadTodos();
  });

  it('changes the current filter and transfer "active" class to the correct buton', ()=>{
    expect(currentFilter).toEqual('all');

    const clickEvent = new MouseEvent('click', { bubbles: true });

    const btn = document.querySelector('[data-filter="active"]');
    const btnAll = document.querySelector('[data-filter="all"]');
    const btnCompleted = document.querySelector('[data-filter="completed"]');

    btn.dispatchEvent(clickEvent);

    expect(currentFilter).toEqual('active');
    expect(btn.classList).toContain('active');
    expect(btnAll.classList).not.toContain('active');
    expect(btnCompleted.classList).not.toContain('active');
  });

  afterAll(()=>{
    testsContainer.innerHTML = '';
  });
});