const newFormHandler = async (event) => {
    event.preventDefault();

    const subject = document.querySelector('#review-name').value.trim();
    const body = document.querySelector('#post-body').value.trim();


    //create a new review
    if (body) {
        //grabs the community_id from the url
        const tempUrl = window.location.href;
        const tempParts = tempUrl.split('/');
        const community_id = parseInt(tempParts[tempParts.length - 2], 10);


        const reviewResponse = await fetch(`/api/reviews/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body, subject, community_id }),
        });

        if (reviewResponse.ok) {
            let responseData = await reviewResponse.json();

            await document.location.replace(`/reviews/${responseData.id}`);
        } else {
            alert('Failed to create review');
        }
    }
};


document
    .querySelector('.new-review-form')
    .addEventListener('submit', newFormHandler);