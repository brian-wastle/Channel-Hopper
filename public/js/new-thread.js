const newFormHandler = async (event) => {
    event.preventDefault();
  
    const threadName = document.querySelector('#thread-name').value.trim();
    const postBody = document.querySelector('#post-body').value.trim();
  
  
    //create a new blog
    if (threadName && postBody) {
      const response = await fetch(`/api/threads`, {
        method: 'POST',
        body: JSON.stringify({ threadName }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to create blog');
      }
    }
  };

  
document
.querySelector('.new-project-form')
.addEventListener('submit', newFormHandler);