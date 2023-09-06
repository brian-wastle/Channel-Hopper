const router = require('express').Router();


router.get('/', async (req, res) => { 
    console.log('hello world')
    console.log(req.query.q)
    let searchTerm = req.query.q

  let response = await fetch(`https://api.tvmaze.com/search/shows?q=${searchTerm}`)
  let shows = await response.json()
  console.log(shows)
    res.render('search', {shows})

});

module.exports = router;
