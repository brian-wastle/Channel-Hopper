const login = async () => {
    const response = await fetch('/login');
  
    if (response.ok) {
      document.location.replace('/login');
    } else {
      alert(response.statusText);
    }
  };
  
  document.querySelector('#login').addEventListener('click', login);
  