const plusOneHandler = async (event) => {
    event.preventDefault();

    //grabs the review_id from the url
    var tempUrl = window.location.href;
    var tempParts = tempUrl.split('/');
    var review_id = tempParts[tempParts.length - 1];

    const reviewResponse = await fetch(`/api/reviews/${review_id}/plusone`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (reviewResponse.ok) {
        let responseData = await reviewResponse.json();

        document.location.reload();
    } else {
        alert('Failed to add plusOne');
    }
};

document
    .querySelector('.plusone-container')
    .addEventListener('click', plusOneHandler);