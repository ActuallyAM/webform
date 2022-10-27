const contactForm = document.querySelector('.contact-form');
let name = document.querySelector('#name');
let email = document.querySelector('#email');
let phone = document.querySelector('#phone');
let position = document.querySelector('#position');
let subject = 'Väärkäitumisest teatamise vorm';
let message_1 = document.querySelector('#message_1');
let message_2 = document.querySelector('#message_2');
let message_3 = document.querySelector('#message_3');
let message_5 = document.querySelector('#message_5');
let attachment = document.querySelector('#attachment');
let anonAnswer = document.forms.contactForm.elements.anon;
let publicAnswer = document.forms.contactForm.elements.public;
let privateAnswer = document.forms.contactForm.elements.private;

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let formData = {
    subject: subject,
    name: name.value,
    email: email.value,
    phone: phone.value,
    position: position.value,
    message_1: message_1.value,
    anonAnswer: anonAnswer.value,
    // attachment: attachment?.value,
  };

  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/');
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onload = function () {
    if (xhr.responseText == 'success') {
      alert('Email sent');
      name.value = '';
      email.value = '';
      phone.value = '';
      position.value = '';
      message_1.value = '';
      anonAnswer.value = '';
      // attachment.value = '';
    } else {
      alert('Something went wrong');
    }
  };

  xhr.send(JSON.stringify(formData));
});
