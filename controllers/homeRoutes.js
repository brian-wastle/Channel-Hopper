const router = require('express').Router();
const { Users, Communities, Reviews, Threads, Posts, CommunityUsers, Plusones } = require('../models');
const Sequelize = require('sequelize');
const withAuth = require('../utils/auth');



//render the homepage
router.get('/', async (req, res) => {
  try {
    // get the two most recent communities
    let communityData = await Communities.findAll({
      order: [['id', 'ASC']], // Order by 'id' column in descending order
    });
    
    const communityOne = communityData.slice(0, 1);
    const communitiesOne = communityOne.map((community) => community.get({ plain: true }));

    communityDataTwo = await Communities.findAll({
      order: [['id', 'DESC']], // Order by 'id' column in descending order
    });
    const communityTwo = communityDataTwo.slice(1, 2);
    const communitiesTwo = communityTwo.map((community) => community.get({ plain: true }));

    //find the threads from community 1

      
    const threadDataOne = await Threads.findAll({
      where: {
        community_id: communitiesOne[0].id,
      },
      order: [['id', 'DESC']],
      include: {
        model: Users,
        attributes: ['name'], 
      },
    });
    const threadsCommunityOne = threadDataOne.map((thread) => thread.get({ plain: true }));

    //find the threads from community 2
    const threadDataTwo = await Threads.findAll({
      where: {
        community_id: communitiesTwo[0].id,
      },
      order: [['id', 'DESC']],
      include: {
        model: Users,
        attributes: ['name'], 
      },
    });
    const threadsCommunityTwo = threadDataTwo.map((thread) => thread.get({ plain: true }));

//find the reviews from community 1
    const reviewDataOne = await Reviews.findOne({
      where: {
        community_id: communitiesOne[0].id,
      },
      order: [['id', 'DESC']],
      limit: 1,
      include: {
        model: Users,
        attributes: ['id','name'], 
      },
    });
    
    const reviewsCommunityOne = reviewDataOne.get({ plain: true });

    //find the reviews from community 2
    const reviewDataTwo = await Reviews.findOne({
      where: {
        community_id: communitiesTwo[0].id,
      },
      order: [['id', 'DESC']],
      limit: 1,
      include: {
        model: Users,
        attributes: ['id','name'], 
      },
    });
    const reviewsCommunityTwo = reviewDataTwo.get({ plain: true });
// console.log(threadsCommunityOne)
// console.log(threadsCommunityTwo)
console.log(reviewsCommunityOne)
console.log(reviewsCommunityTwo)

    res.render('homepage', {
      communitiesOne,
      communitiesTwo,
      threadsCommunityOne,
      threadsCommunityTwo,
      reviewsCommunityOne,
      reviewsCommunityTwo,
      logged_in: req.session.logged_in,
    });
    
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
      logged_in: req.session.logged_in,
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

    let reviewData = await Reviews.findByPk(req.params.id, {
      include: [
        {
          model: Users,
          attributes: ['name'],
        },
        {
          model: Communities,
          where: { id: Sequelize.col('Reviews.community_id') }, 
          required: true,
        },
      ],
    });
    const reviews = reviewData.get({ plain: true });

    //check to see if a user has already given a plusOne on a review

    const plusOneData = await Plusones.findOne({
      where: {
        user_id: currentUserId,
        review_id: req.params.id,
      },
    });
    
    if (plusOneData) {
      plusOneRender = false;
    } else {
      plusOneRender = true;
    }

    res.render('review', {
      ...reviews,
      logged_in: req.session.logged_in,
      current_user_id: currentUserId,
      plus_one_render: plusOneRender
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
