
jQuery (document).ready(function() {
    $("#searchButton").on('click', function() {
        let query = $("#searchInput").val();
        
document.location.replace(`/search?q=${query}`)
       
    });
});

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

function renderResults(data) {
    let shows = data.map(entry => entry.show); 
    let filteredData = shows.map(show => {
        console.log(show.schedule.time)
        return {
            name: show.name,
            schedule: {
                time: show.schedule.time,

                day: show.schedule.days
            },
            image: show.image.medium,
            summary: show.summary,
            status: show.status,
            
        };
    });

    let source = $("#tv-show-template").html();
    // let template = Handlebars.compile(source);
    // let rendered = template(filteredData);
    // $("#searchResults").html(rendered);
}