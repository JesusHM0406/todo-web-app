const CONTAINER_ID = 'notification-stack-container';
const MAX_NOTIFICATIONS = 3;

export function getNotificationsContainer(){
  let notifContainer = document.getElementById(CONTAINER_ID);

  if(!notifContainer){
    notifContainer = document.createElement('div');
    notifContainer.id = CONTAINER_ID;

    document.querySelector('.main').appendChild(notifContainer);
  }

  return notifContainer;
};

export function closeNotification(notification){
  if (!notification) return;

  notification.classList.add('is-removing');

  notification.classList.remove('show');

  notification.addEventListener('transitionend', function handler(){
      notification.remove();

      notification.removeEventListener('transitionend', handler);

      const notifContainer = getNotificationsContainer();

      if (notifContainer.children.length === 0) {
        notifContainer.remove(); 
      }
    }, { once: true });
}

export function showNotification(message, type){
  const notifContainer = getNotificationsContainer();
  const notifications = Array.from(notifContainer.children);
  const activeNotifications = notifications.filter(n => !n.classList.contains('is-removing'));

  if (notifications.length >= MAX_NOTIFICATIONS){
    const oldestNotification = activeNotifications[0];

    closeNotification(oldestNotification);
  };

  const notification = document.createElement('div');
  notification.classList.add('notification', type);

  setTimeout(()=>{
    notification.classList.add('show');
  }, 0);

  const notifIcon = type === 'success' ? 'check_circle' : 'dangerous';

  const notifIconSpan = document.createElement('span');
  notifIconSpan.classList.add('material-symbols-rounded');
  notifIconSpan.textContent = notifIcon;

  const notifText = document.createElement('span');
  notifText.classList.add('notification__text');
  notifText.textContent = message;
  
  notification.appendChild(notifIconSpan);
  notification.appendChild(notifText);

  notifContainer.appendChild(notification);

  setTimeout(()=>{
    closeNotification(notification);
  }, 5000);
};