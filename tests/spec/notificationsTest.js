import { showNotification } from "../../js/notifications.js";

describe('showNotification', ()=>{
  beforeEach(()=>{
    document.querySelector('.tests').innerHTML = `
      <div class="main"></div>
    `;
  });

  it('creates a notification correctly', ()=>{
    showNotification('Message', 'success');

    const notifContainer = document.getElementById('notification-stack-container');
    const notif = document.querySelectorAll('.notification.success');


    expect(notifContainer).not.toBe(null);
    expect(notif.length).toBe(1);
  });

  it('only shows a maximum of 3 notifications', ()=>{
    for (let i = 0; i < 6; i++){
      showNotification(`Notif ${i}`, 'success');
    };

    const notifContainer = document.getElementById('notification-stack-container');

    expect(notifContainer).not.toBe(null);
    expect(notifContainer.children.length).toBe(6);

    const removingNotifs = Array.from(notifContainer.children).filter(n => n.classList.contains('is-removing'));

    expect(removingNotifs.length).toBe(3);

    removingNotifs.forEach(n => {
      const event = new Event('transitionend');
      n.dispatchEvent(event);
    });

    expect(notifContainer.children.length).toBe(3);
  });

  it('removes notifications after 5s', ()=>{
    jasmine.clock().install();

    showNotification('Message', 'success');

    const notifContainer = document.getElementById('notification-stack-container');
    const notif = document.querySelector('.notification.success');

    expect(notifContainer).not.toBe(null);
    expect(notifContainer.children.length).toBe(1);

    jasmine.clock().tick(5000);

    const event = new Event('transitionend');
    notif.dispatchEvent(event);

    expect(notifContainer.children.length).toBe(0);

    jasmine.clock().uninstall();
  });

  afterEach(()=>{
    document.querySelector('.tests').innerHTML = '';
  });
});