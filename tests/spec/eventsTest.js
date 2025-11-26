import { atachEventListeners, handleAddTask, handleClearTasksClick, handleDeleteClick } from "../../js/events.js";

const testsContainer = document.querySelector('.tests');

describe('handleAddTask', ()=>{
  let createFunc, showFunc, showPendingFunc, showNotifFunc;
  const testsContainer = document.querySelector('.tests');

  testsContainer.innerHTML = `
    <input type="text" id="taskInput" value="New Task">
    <button id="addBtn">
    <div class="content__filter">
      <button class="filter-btn">
    </div>
    <button id="clearCompleted">
    <button id="togglerBtn">
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