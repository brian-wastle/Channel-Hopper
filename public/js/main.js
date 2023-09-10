
const getHomepage = async () => {
  const response = await fetch('/');

  if (response.ok) {
    document.location.replace('/');
  } else {
    alert(response.statusText);
  }
};

const getDashboard = async () => {
    const response = await fetch('/profile');
  
    if (response.ok) {
      document.location.replace('/profile');
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


//navbar menu for mobile

const burgerMenu = document.querySelector(".navbar-burger");
const navLinks = document.querySelector(".navbar-menu");


burgerMenu.addEventListener('click', () => {
navLinks.classList.toggle('is-active');
})

