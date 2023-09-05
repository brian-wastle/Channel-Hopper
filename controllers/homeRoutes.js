const router = require('express').Router();
const { Users, Communities, CommunityUsers, Threads, Reviews } = require('../models');
const withAuth = require('../utils/auth');


router.get('/', async (req, res) => {
  try {
    res.render('login');
    
  } catch (err) {
    res.status(500).json(err);
  }
});

//render the user's profile page
router.get('/profile', async (req, res) => {
  
  try {
//get communities
// TO DO: cannot get current communities, sequelize errors due to associations betweek communityusers table and users table

//get all user's threads
    const threadData = await Threads.findAll({ where: { user_id: 2 } });
    const threads = threadData.map((thread) => thread.get({ plain: true }));
//get all user's reviews
    const reviewData = await Reviews.findAll({ where: { user_id: 2 } });
    const reviews = reviewData.map((review) => review.get({ plain: true }));

//render profile with threads and reviews data
    res.render('profile', { 
      threads, 
      reviews,
      // logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Show a single Review



//send user to signup page
router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('signup');
});

//checks to see if user is logged in
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
