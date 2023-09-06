

const getHomepage = async () => {
  const response = await fetch('/');

  if (response.ok) {
    document.location.replace('/');
  } else {
    alert(response.statusText);
  }
};

const getDashboard = async () => {
    const response = await fetch('/dashboard');
  
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  };
  
  $(document).ready(function() {
    $('#gotoSearch').on('click', function() {
        window.location.href = '/search';
    });
});

document.querySelector('#homepage').addEventListener('click', getHomepage);
if(document.getElementById('dashboard')){
  document.querySelector('#dashboard').addEventListener('click', getDashboard);
}

  