const router = require('express').Router();
const dayjs = require('dayjs');

router.get('/', async (req, res) => { 
    
    console.log(req.query.q)
    let searchTerm = req.query.q

     // Check if searchTerm is undefined or empty
     if (!searchTerm || searchTerm.trim() === "") {
        return res.render('search', {shows: []}); // Return an empty array for shows
    }

  let response = await fetch(`https://api.tvmaze.com/search/shows?q=${searchTerm}`)
  let shows = await response.json()
//   console.log(shows)
  let processedData = shows.map(showEntry => {
    let show = showEntry.show;
    let result = {
        api_id: show.id,
        name: show.name,
        image: show.image,
        summary: show.summary,
        status: show.status,
        premiere: show.premiered ? dayjs(show.premiered).format('MM/DD/YYYY') : null,
        ended: show.ended? dayjs(show.ended).format('MM/DD/YYYY') : null,
        runtime: show.averageRuntime,
        officialSite: show.officialSite,
       
        messages: []
    };
    if (show.officialSite === null) {result.messages.push ("This show does not have an official site.")};

    //if statements for show runtime 
    if (show.runtime === null) {result.messages.push ("This show's average runtime is unknown.")};
    if (show.runtime){result.messages.push(`This show's average runtime is ${show.runtime} minutes.`)}

    //if statements for if show has official site or not
    if (show.officialSite ) {result.messages.push(`This show's official site is ${show.officialSite}`)};
  

    //if statements for when show premiered and ended
    if (show.premiered === null) {result.messages.push("This show has not premiered yet.")};
    if (show.premiered){result.messages.push(`This show premiered on ${result.premiere}`)};
    if (show.ended === null) {result.messages.push("This show is still in production.")};
    if (show.ended){result.messages.push(`This show ended on ${result.ended}`)};


    //if statement for if show has ended or not
    if (show.status !== 'Ended') {
        if(!show.schedule.time && show.schedule.days ){
            result.messages.push ( `This show airs on ${show.schedule.days}`);}
            if( show.schedule.time && !show.schedule.days){
                result.messages.push ( `This show airs at ${show.schedule.time}`);}
        if (show.schedule.time && show.schedule.days){
        result.messages.push ( `This show airs on ${show.schedule.days} at ${show.schedule.time}`)
        };
    }
  
    return result;
});
    res.render('search', {shows: processedData})

});

module.exports = router;
