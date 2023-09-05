const blog_id = window.location.toString().split('/')[
  window.location.toString().split('/').length - 1
];

const newFormHandler = async (event) => {
  event.preventDefault();

const name = document.querySelector('#project-name').value.trim();
const description = document.querySelector('#project-desc').value.trim();


  //update a blog
  if (name && description) {
    const response = await fetch(`/api/blogs/edit/${blog_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else { 
      alert('Failed to update blog');
    }
  }
};

  //delete a blog
const delButtonHandler = async (event) => {

    const response = await fetch(`/api/blogs/${blog_id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to delete blog');
    }
};
  
document
.querySelector('.edit-project-form')
.addEventListener('submit', newFormHandler);

document
  .querySelector('#del-button')
  .addEventListener('click', delButtonHandler);