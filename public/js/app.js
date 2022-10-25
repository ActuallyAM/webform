const contactForm = document.querySelector('.contact-form');
let name = document.querySelector('#name');
let email = document.querySelector('#email');
let subject = document.querySelector('#subject');
let message = document.querySelector('#message');
let attachment = document.querySelector('#attachment');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let formData = {
    name: name.value,
    email: email.value,
    subject: subject.value,
    message: message.value,
    attachment: attachment?.path,
  };

  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/');
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.onload = function () {
    console.log(xhr.responseText);
    if (xhr.responseText == 'success') {
      alert('Email sent');
      name.value = '';
      email.value = '';
      subject.value = '';
      message.value = '';
    } else {
      alert('Something went wrong');
    }
  };

  xhr.send(JSON.stringify(formData));
});
