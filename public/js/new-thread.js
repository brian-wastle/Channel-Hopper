const newFormHandler = async (event) => {
    event.preventDefault();
  
    const subject = document.querySelector('#thread-name').value.trim();
    const body = document.querySelector('#post-body').value.trim();
  
  
    //create a new thread
    if (subject && body) {
//grabs the community_id from the url
      const tempUrl = window.location.href;
      const tempParts = tempUrl.split('/');
      const community_id = parseInt(tempParts[tempParts.length - 2], 10);

      const threadResponse = await fetch(`/api/threads/`, {
        method: 'POST',
        body: JSON.stringify({ subject, community_id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (threadResponse.ok) {

        fetch(`/api/threads/threadid`)
          .then(response => response.json())
          .then(data => {
            let thread_id = data.thread_id;
            return thread_id;
          })
        
          .then(thread_id => { 
            fetch(`/api/posts/`, {
            method: 'POST',
            body: JSON.stringify({ body, thread_id }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
          })
      } else {
        alert('Failed to create thread');
      }
    }
  };

  
document
.querySelector('.new-thread-form')
.addEventListener('submit', newFormHandler);