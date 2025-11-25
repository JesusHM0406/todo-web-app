import { atachEventListeners, handleAddTask } from "../../js/events.js";
import { todoAPI } from "../../js/todo.js";

const testsContainer = document.querySelector('.tests');

describe('atachEventListeners', ()=>{
  beforeAll(()=>{
    testsContainer.innerHTML = `
      <input type="text" id="taskInput">
      <button id="addBtn">
      <div class="content__filter">
        <button class="filter-btn">
      </div>
      <button id="clearCompleted">
      <button id="togglerBtn">
      <div class="content__todo-list"></div>
    `;

    atachEventListeners();
  });

  it('add event', ()=>{
    spyOn(todoAPI, 'createTask');

    handleAddTask();

    expect(todoAPI.createTask).toHaveBeenCalled();
  });

  afterAll(()=>{
    testsContainer.innerHTML = '';
  });
});