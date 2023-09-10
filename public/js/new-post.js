const newFormHandler = async (event) => {
    event.preventDefault();

    const body = document.querySelector('#post-body').value.trim();



    //create a new thread
    if (body) {
        //grabs the community_id from the url
        var tempUrl = window.location.href;
        var tempParts = tempUrl.split('/');
        var thread_id = tempParts[tempParts.length - 1];
        
        console.log(thread_id)
        console.log(body)
        console.log(JSON.stringify({ body }))

            const threadResponse = await fetch(`/api/posts/${thread_id}`, {
                method: 'POST',
                body: JSON.stringify({ body }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });


        if (threadResponse.ok) {
            await window.location.replace(
                `/threads/${thread_id}`,
              );
        } else {
            alert('Failed to create post');
        }
    }
};


document
    .querySelector('.new-comment-form')
    .addEventListener('click', newFormHandler);