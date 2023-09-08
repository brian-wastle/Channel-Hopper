const router = require('express').Router();
const { Users, Communities, Reviews, Threads, Posts, CommunityUsers } = require('../models');
const withAuth = require('../utils/auth');
const dayjs = require('dayjs');


//Get a single communtiy

router.get('/:id', async (req, res) => {
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

    const communityData = await Communities.findOne({ where: { id: req.params.id } });
    const community = communityData.get({ plain: true });

    const threadData = await Threads.findAll({ where: { community_id: community.id } });
    const threadsArray = threadData.slice(0, 3);
    const threads = threadsArray.map((thread) => thread.get({ plain: true }));

    const reviewData = await Reviews.findAll({ where: { community_id: community.id } });
    const reviewsArray = reviewData.slice(0, 3);
    const reviews = reviewsArray.map((thread) => thread.get({ plain: true }));

    res.render('community', {
      ...community,
      threads,
      reviews,
      logged_in: req.session.logged_in,
      current_user_id: currentUserId
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/name/:api_id', async (req, res) => {
  console.log(req.params.name)
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

    let communityData = await Communities.findOne({ where: { api_id: req.params.api_id } });
    console.log(communityData)
    if (communityData) {
      res.redirect(`/community/${communityData.id}`)
    }
    if (communityData === null) {

      //need id for community

      let response = await fetch(`https://api.tvmaze.com/shows/${req.params.api_id}`)
      let show = await response.json()
      console.log(show)

      let result = {
        api_id: show.id,
        name: show.name,
        image: show.image.medium,
        summary: show.summary,
        status: show.status,
        premiere: show.premiered ? dayjs(show.premiered).format('MM/DD/YYYY') : null,
        ended: show.ended ? dayjs(show.ended).format('MM/DD/YYYY') : null,
        runtime: show.averageRuntime,
        officialSite: show.officialSite,

      };


      try {
        console.log(result)        
        communityData = await Communities.create(result)
        console.log(communityData)
        res.redirect(`/community/${communityData.id}`)
      } catch (error) {
        console.log(error)
      }

     

    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
})


//create a new community
router.post('/', withAuth, async (req, res) => {
  try {
    const newCommunity = await Communities.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newCommunity);
  } catch (err) {
    res.status(400).json(err);
  }
});


//retrieves all threads associated with a single community 

router.get('/:id/threads', async (req, res) => {
  try {

    const communityData = await Communities.findOne({ where: { id: req.params.id } });
    const community = communityData.get({ plain: true });

    const threadData = await Threads.findAll({ where: { community_id: req.params.id } });
    const threads = threadData.map((thread) => thread.get({ plain: true }));

    res.render('conversations', { threads, community, logged_in: req.session.logged_in })

  } catch (err) {
    res.status(500).json(err);
  }
});

//retrieves all reviews for a single community
router.get('/:id/reviews', async (req, res) => {
  try {

    const communityData = await Communities.findOne({ where: { id: req.params.id } });
    const community = communityData.get({ plain: true });

    const reviewData = await Reviews.findAll({ where: { community_id: req.params.id } });
    const reviews = reviewData.map((review) => review.get({ plain: true }));

    res.render('reviews', { reviews, community, logged_in: req.session.logged_in })

  } catch (err) {
    res.status(500).json(err);
  }
});


//takes user to new thread page
router.get('/:id/newthread', async (req, res) => {
  try {

    res.render('newThread', {
      logged_in: req.session.logged_in
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

//takes user to new review page
router.get('/:id/newreview', async (req, res) => {
  try {

    res.render('newreview', {
      logged_in: req.session.logged_in
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
