const router = require('express').Router();
const { Users, Communities, Reviews, Threads, Posts, CommunityUsers } = require('../models');
const withAuth = require('../utils/auth');



//render the homepage
router.get('/', async (req, res) => {
  try {
    res.render('login');
    
  } catch (err) {
    res.status(500).json(err);
  }
});




//render the user's profile page
router.get('/profile', withAuth, async (req, res) => {
  
  try {
//get communities

    if (req.session.user_id) {
      var user = await Users.findOne({
        where: {
          id: req.session.user_id,
        },
        attributes: ['name', 'id'], 
        });
      } else {
        var user;
      }

    if (user) {
        var currentUserId = user.dataValues.id;
      } else {
        var currentUserId = 0;
      }



    const commData = await Communities.findAll({
      include: [
        {
          model: Users,
          through: CommunityUsers, 
          where: { id: currentUserId },
        },
      ],
    });
    const communities = commData.map((community) => community.get({ plain: true }));
console.log(currentUserId)
//get all user's threads
    const threadData = await Threads.findAll({ where: { user_id: currentUserId } });
    const threads = threadData.map((thread) => thread.get({ plain: true }));
//get all user's reviews
    const reviewData = await Reviews.findAll({ where: { user_id: currentUserId } });
    const reviews = reviewData.map((review) => review.get({ plain: true }));
//render profile with threads and reviews data
    res.render('profile', { 
      threads, 
      reviews,
      communities,
      // logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});





//Show a single Review

router.get('/reviews/:id', async (req, res) => {
  try {
    if (req.session.user_id) {
    var user = await Users.findOne({
      where: {
        id: req.session.user_id,
      },
      attributes: ['name', 'id'], 
      });
    } else {
      var user;
    }

  if (user) {
      var currentUserId = user.dataValues.id;
    } else {
      var currentUserId = 0;
    }


    const reviewData = await Reviews.findByPk(req.params.id, {
      include: [
        { 
          model: Users, 
          attributes: ['name'] 
        }, 
      ],
    });
    const reviews = reviewData.get({ plain: true });

    res.render('review', {
      ...reviews,
      logged_in: req.session.logged_in,
      current_user_id: currentUserId
    });
  } catch (err) {
    res.status(500).json(err);
  }
});




//get a single thread

router.get('/threads/:id', async (req, res) => {
  try {
    if (req.session.user_id) {
    var user = await Users.findOne({
      where: {
        id: req.session.user_id,
      },
      attributes: ['name', 'id'], 
    });
    } else {
      var user;
    }



    if (user) {
      var currentUserId = user.dataValues.id;
    } else {
      var currentUserId = 0;
    }

    const threadData = await Threads.findOne({ where: { id: req.params.id } });
    const thread = threadData.get({ plain: true });

    const postData = await Posts.findAll({ where: { thread_id: req.params.id } }, {
      include: {
        model: Users,
        required: true
      }});
    const posts = postData.map((post) => post.get({ plain: true }));
    
    console.log(posts)

    res.render('thread', {
      ...thread,
      posts,
      logged_in: req.session.logged_in,
      current_user_id: currentUserId
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

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
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
