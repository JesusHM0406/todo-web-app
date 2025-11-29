import { clearTasks, createTask, deleteTodo, getFilteredTodos, loadTodos, saveTodos, todos, toggleTodo } from "../../js/todo.js";

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

describe('toggleTodo', ()=>{
  beforeEach(()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { id: '123', name: 'todo name', isCompleted: false },
      { id: '321', name: 'name todo', isCompleted: false }
    ]));
    spyOn(localStorage, 'setItem');
    loadTodos();
  });

  it('returns true if it updates the task', ()=>{
    expect(toggleTodo('123')).toEqual(true);
    expect(todos[0].isCompleted).toEqual(true);
  });

  it("returns false if the id doesn't exists in the todo list", ()=>{
    expect(toggleTodo('345')).toEqual(false);
  });
});

describe('clearTasks', ()=>{
  it('returns false if no task has been completed', ()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { id: '123', name: 'todo name', isCompleted: false },
      { id: '321', name: 'name todo', isCompleted: false }
    ]));
    spyOn(localStorage, 'setItem');
    loadTodos();

    expect(clearTasks()).toEqual(false);
    expect(todos.length).toEqual(2);
  });

  it("returns true if completed tasks are deleted", ()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { id: '123', name: 'todo name', isCompleted: true },
      { id: '321', name: 'name todo', isCompleted: false }
    ]));
    spyOn(localStorage, 'setItem');
    loadTodos();
    
    expect(clearTasks()).toEqual(true);
    expect(todos.length).toEqual(1);
    expect(todos[0].id).toEqual('321')
  });
});

describe('getFilteredTodos', ()=>{
  beforeEach(()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { id: '123', name: 'todo name', isCompleted: true },
      { id: '321', name: 'name todo', isCompleted: false },
      { id: '456', name: 'new todo', isCompleted: true }
    ]));
    spyOn(localStorage, 'setItem');
    loadTodos();
  });

  it('returns 3 tasks when filter is "all"', ()=>{
    const result = getFilteredTodos('all')

    expect(result.length).toEqual(3);
    expect(result).toEqual([
      { id: '123', name: 'todo name', isCompleted: true },
      { id: '321', name: 'name todo', isCompleted: false },
      { id: '456', name: 'new todo', isCompleted: true }
    ]);
  });

  it('returns 1 task when filter is "active"', ()=>{
    const result = getFilteredTodos('active');

    expect(result.length).toEqual(1);
    expect(result).toEqual([
      { id: '321', name: 'name todo', isCompleted: false }
    ]);
  });

  it('returns 2 tasks when filter is "completed"', ()=>{
    const result = getFilteredTodos('completed')

    expect(result.length).toEqual(2);
    expect(result).toEqual([
      { id: '123', name: 'todo name', isCompleted: true },
      { id: '456', name: 'new todo', isCompleted: true }
    ]);
  });
});

describe('saveTodos', ()=>{
  it('calls localStorage.setItem() with the correct values', ()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { id: '123', name: 'todo name', isCompleted: false },
      { id: '321', name: 'name todo', isCompleted: false }
    ]));
    spyOn(localStorage, 'setItem');
    loadTodos();

    saveTodos();

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('todos', JSON.stringify([
      { id: '123', name: 'todo name', isCompleted: false },
      { id: '321', name: 'name todo', isCompleted: false }
    ]));
  });
});

describe('loadTodos', ()=>{
  it('returns the todos JSON if the data is correct', ()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { id: '123', name: 'todo name', isCompleted: false },
      { id: '321', name: 'name todo', isCompleted: false }
    ]));
    loadTodos();

    expect(todos).toEqual([
      { id: '123', name: 'todo name', isCompleted: false },
      { id: '321', name: 'name todo', isCompleted: false }
    ]);
  });

  it('returns an empty array if the data is invalid', ()=>{
    spyOn(localStorage, 'getItem').and.returnValue('hello');
    loadTodos();

    expect(todos).toEqual([]);
  });
});