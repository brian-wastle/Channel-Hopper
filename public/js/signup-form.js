document.getElementById('avatar-group').addEventListener('click', function(event) {
  if ( event.target.matches('.avatar-img')){
    console.log("clicked on an avatar")
    
    let avatars = document.querySelectorAll('.avatar-img');
    avatars.forEach(avatar => {
      avatar.classList.remove('avatar-selected');
      event.target.classList.add('avatar-selected');
      document.getElementById('avatar-path').value = event.target.src;
    });
  }});
  
  const signupFormHandler = async (event) => {
    event.preventDefault();
  
    const name = document.querySelector('#name-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    const avatarPath = document.querySelector('.avatar-selected').src;
    console.log(avatarPath);
  
    if (name && email && password && avatarPath) {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, avatarPath}),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/profile');
      } else {
        alert(response.statusText);
      }
    }
  };


function loginButtonHandler() {
    document.location.replace('/signup');
}
  
document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);


// document
//   .querySelector('#login-button')
//   .addEventListener('click', loginButtonHandler);

