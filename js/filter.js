export let currentFilter = 'all';

export function setFilter(filter){
  if(['all', 'active', 'completed'].includes(filter)){
    currentFilter = filter;
    return true;
  }

  return false;
};