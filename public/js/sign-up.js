const signUp = async () => {
    const response = await fetch('/signup');
  
    if (response.ok) {
      document.location.replace('/signup');
    } else {
      alert(response.statusText);
    }
  };
  
  document.querySelector('#signup').addEventListener('click', signUp);