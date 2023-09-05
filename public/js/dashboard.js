
// takes you to "create new blog page"
const createButtonHandler = async () => {
  
  const response = await fetch('/newblog');
  
  if (response.ok) {
    document.location.replace('/newBlog');
  } else {
    alert(response.statusText);
  }
  };


document
.querySelector('#createBlog')
.addEventListener('click', createButtonHandler);

