const newFormHandler = async (event) => {
    event.preventDefault();

    const body = document.querySelector('#post-body').value.trim();



    //create a new thread
    if (body) {
        //grabs the community_id from the url
        var tempUrl = window.location.href;
        var tempParts = tempUrl.split('/');
        var thread_id = tempParts[tempParts.length - 1];

        const threadResponse = await fetch(`/api/posts/${thread_id}`, {
            method: 'POST',
            body: JSON.stringify({ body, thread_id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (threadResponse.ok) {
            await document.location.reload();
        } else {
            alert('Failed to create post');
        }
    }
};


document
    .querySelector('.new-comment-form')
    .addEventListener('submit', newFormHandler);