// =========== IMPORTS =========== //

import { todoAPI } from "./todo.js";
import { showTodos, showPendingTasks, initializeUISelectors } from "./appUi.js";
import { atachEventListeners } from "./events.js";
import { initializeTheme } from "./theme.js";

// =========== INITIALIZATION =========== //

export function initializeApp(){
  todoAPI.loadTodos();
  initializeUISelectors();
  showTodos();
  showPendingTasks();
  initializeTheme();
  atachEventListeners();
};