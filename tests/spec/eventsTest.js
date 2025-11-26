import { atachEventListeners, handleAddTask } from "../../js/events.js";

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

  it('all notification and NOT call view functions if logic fails', ()=>{
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