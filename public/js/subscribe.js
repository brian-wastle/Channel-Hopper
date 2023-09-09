const subscribeHandler = async (event) => {
    event.preventDefault();
  
      //grabs the community_id from the end of the url
      var tempUrl = window.location.href;
      var tempParts = tempUrl.split('/');
      var community_id = tempParts[tempParts.length - 1];
      const subscribeResponse = await fetch(`/api/users/subscribe`, {
        method: 'POST',
        body: JSON.stringify({ community_id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (subscribeResponse.ok) {
        window.location.reload();
      } else {
        alert('Failed to subscribe to this community!');
      }
    };


  
document
.querySelector('.subscribe-button-container')
.addEventListener('click', subscribeHandler);