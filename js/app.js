// =========== IMPORTS =========== //

import { loadTodos } from "./todo.js";
import { showTodos, showPendingTasks, initializeUISelectors } from "./app-ui.js";
import { atachEventListeners } from "./events.js";
import { initializeTheme } from "./theme.js";

// =========== INITIALIZATION =========== //

export function initializeApp(){
  loadTodos();
  initializeUISelectors();
  showTodos();
  showPendingTasks();
  initializeTheme();
  atachEventListeners();
};