
jQuery (document).ready(function() {
    $("#searchButton").on('click', function() {
        let query = $("#searchInput").val();
        
document.location.replace(`/search?q=${query}`)
       
    });
});



// function renderResults(data) {
//     let shows = data.map(entry => entry.show); 
//     let filteredData = shows.map(show => {
//         console.log(filteredData)
//         let result = {
//             name: show.name,
//             image: show.image.medium,
//             summary: show.summary,
//             status: show.status,
            
//         };
//         if (show.status !== 'Ended') {
//             result.schedule ={
//                 time: show.schedule.time,
//                 day: show.schedule.days
//             };
//         }else {result.message = "This show has ended.";}
        
//         return result;
//     });

//     let source = $("#tv-show-template").html();
//    ;
// }
 // let template = Handlebars.compile(source);
    // let rendered = template(filteredData);
    // $("#searchResults").html(rendered)


// function searchTVShows(query) {
//     $.ajax({
//         url: `https://api.tvmaze.com/search/shows?q=${query}`,
//         method: 'GET',
//         dataType: 'json',
//         success: function(data) {
//             console.log(data);
//             renderResults(data); 
//         },
//         error: function(error) {
//             console.error('Failed to fetch TV shows', error);
//         }
//     });
// }