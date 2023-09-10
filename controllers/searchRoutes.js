const router = require('express').Router();
const dayjs = require('dayjs');
const withAuth = require('../utils/auth');
const { Searches } = require('../models');
const sequelize = require('../config/connection');

router.get('/', async (req, res) => { 
    
    console.log(req.query.q)
    let searchTerm = req.query.q

     // Check if searchTerm is undefined or empty
     if (!searchTerm || searchTerm.trim() === "") {
        return res.render('search', {shows: [],
            logged_in: req.session.logged_in,}); // Return an empty array for shows
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
    res.render('search', {
        shows: processedData,
        logged_in: req.session.logged_in,
    })

});


//save searches to the searches table
router.post('/', async (req, res) => { 

// Define the new search query
const newQuery = req.query.q;

// Start a transaction
sequelize.transaction(async (newSearch) => {
  try {
    // Insert the new search query
    await Searches.create({ query: newQuery }, { transaction: newSearch });

    // Check the number of rows in the table
    const rowCount = await Searches.count();

    // If there are more than 25 rows, delete the top row
    if (rowCount > 25) {
      await Searches.destroy({
        where: {},
        limit: 1,
        order: [['id', 'ASC']], // Assuming 'id' is the primary key
        transaction: newSearch,
      });
    }

    // Commit the transaction
    await newSearch.commit();

    console.log('Search query added and excess rows deleted successfully.');
  } catch (error) {
    // Rollback the transaction in case of an error
    await newSearch.rollback();
    console.error('Error:', error);
  }
});

});










module.exports = router;
