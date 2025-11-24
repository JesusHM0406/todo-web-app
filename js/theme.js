let currentTheme = 'light';
let togglerBtn = null;

export function toggleTheme(){
  const icon = togglerBtn.querySelector('.material-symbols-rounded');
  
  if (currentTheme === 'light') {
    currentTheme = 'dark';
    
    document.body.classList.add('dark-mode');

    icon.classList.add('dark', 'transitioning');

    icon.addEventListener('transitionend', ()=>{
      icon.textContent = 'dark_mode';
      icon.classList.remove('transitioning');
    });
  }
  else {
    currentTheme = 'light';

    document.body.classList.remove('dark-mode');
  
    icon.classList.remove('dark');
    icon.classList.add( 'transitioning');

    icon.addEventListener('transitionend', ()=>{
      icon.textContent = 'light_mode';
      icon.classList.remove('transitioning');
    });
  }
};

export function initializeTheme(){
  togglerBtn = document.getElementById('togglerBtn');
};