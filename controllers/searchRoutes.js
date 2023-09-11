const router = require('express').Router();
const dayjs = require('dayjs');
const withAuth = require('../utils/auth');
const { Searches } = require('../models');
const sequelize = require('../config/connection');

router.get('/results', async (req, res) => { 
    
    let searchTerm = req.query.q

     // Check if searchTerm is undefined or empty
     if (!searchTerm || searchTerm.trim() === "") {
        return res.render('search', {shows: [],
            logged_in: req.session.logged_in,}); // Return an empty array for shows
    }

  let response = await fetch(`https://api.tvmaze.com/search/shows?q=${searchTerm}`)
  let shows = await response.json()
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




const  query  = req.query.q; // Assuming you send the query as JSON in the request body

  try {
    // Create a new query entry
    await Searches.create({ query });

    // Check if there are more than 25 rows
    const rowCount = await Searches.count();
    if (rowCount > 25) {
      // Find the earliest query and delete it
      const earliestQuery = await Searches.findOne({ order: [['id', 'ASC']] });
      await earliestQuery.destroy();
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding query' });
  }


  try {
    // Find up to the three most common search queries
    const mostCommonQueries = await Searches.findAll({
      attributes: [
        'query',
        [sequelize.fn('COUNT', sequelize.col('query')), 'queryCount'],
      ],
      group: ['query'],
      order: [[sequelize.literal('queryCount'), 'DESC']],
      limit: 3, // Limit the results to the top 3
    });

    var topQueries = mostCommonQueries.map((result) => result.query);
  } catch (error) {
    console.error('Error:', error);
  }

    res.render('results', {
      shows: processedData,
      logged_in: req.session.logged_in,
    })

});

router.get('/', async (req, res) => { 


try {
  // Find up to the three most common search queries
  const mostCommonQueries = await Searches.findAll({
    attributes: [
      'query',
      [sequelize.fn('COUNT', sequelize.col('query')), 'queryCount'],
    ],
    group: ['query'],
    order: [[sequelize.literal('queryCount'), 'DESC']],
    limit: 3, // Limit the results to the top 3
  });

  var topQueries = mostCommonQueries.map((result) => result.query);
} catch (error) {
  console.error('Error:', error);
}

console.log(topQueries)

  res.render('search', {
    queries:topQueries,
    logged_in: req.session.logged_in,
  })

});
module.exports = router;
