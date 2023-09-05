const commentFormHandler = async (event) => {
  event.preventDefault();

  const comment = document.querySelector('#comment-box').value.trim();

  //add a comment
  if (comment) {
    const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1];

      const response = await fetch(`/api/comments/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
      });
      
      if (response.ok) {
        await document.location.reload();
      } else {
        alert('Failed to create comment');
      }
    }
  };

  document
.querySelector('.form-submit')
.addEventListener('submit', commentFormHandler);


document.addEventListener('click', async (event) => {
  if ( event.target.id === 'del-button') {
    const id = event.target.getAttribute('data-id');
    const response = await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert('Failed to delete comment');
    }
  }
});