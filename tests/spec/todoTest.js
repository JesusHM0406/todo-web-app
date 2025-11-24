import { createTask, deleteTodo, loadTodos, todos } from "../../js/todo.js";

describe('createTask', ()=>{
  beforeEach(()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { id: '123', name: 'todo name', isCompleted: false },
      { id: '321', name: 'name todo', isCompleted: false }
    ]));
    spyOn(localStorage, 'setItem');
    loadTodos();
  });

  it('adds a new task', ()=>{
    createTask('new todo');

    expect(todos.length).toEqual(3);
    expect(todos[2].name).toEqual('new todo');
    expect(todos[2].isCompleted).toEqual(false);
  });

  it("doesn't add a new task if the todo name is empty and return an Error", ()=>{
    expect(()=>{
      createTask('')
    }).toThrowError('Cannot add an empty task');
    expect(todos.length).toEqual(2);
  });

  it("doesn't add a new task if the todo name already exists and return an Error", ()=>{
    expect(()=>{
      createTask('todo name')
    }).toThrowError('There is already a task with that name');
    expect(todos.length).toEqual(2);
  });
});

describe('deleteTodo', ()=>{
  beforeEach(()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { id: '123', name: 'todo name', isCompleted: false },
      { id: '321', name: 'name todo', isCompleted: false }
    ]));
    spyOn(localStorage, 'setItem');
    loadTodos();
  });

  it('returns true if it deletes the task', ()=>{
    expect(deleteTodo('123')).toEqual(true);
  });

  it("returns false if the id doesn't exists in the todo list", ()=>{
    expect(deleteTodo('ok')).toEqual(false);
  });
});