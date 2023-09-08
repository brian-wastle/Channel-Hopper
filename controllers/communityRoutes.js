const router = require('express').Router();
const { Users, Communities, Reviews, Threads, Posts, CommunityUsers } = require('../models');
const Sequelize = require('sequelize');
const withAuth = require('../utils/auth');



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
;
//finds the most popular threads based on the number of posts on that thread and returns the top 3
    const threadData = await Threads.findAll({
      attributes: [
        'id',
        'subject',
        'date_created',
        [Sequelize.literal('(SELECT COUNT(*) FROM posts WHERE posts.thread_id = threads.id)'), 'post_count'],
      ],
      include: [
        {
          model: Posts,
          attributes: [],
          required: false, // Use 'required: false' to perform a LEFT JOIN
        },
      ],
      where: { community_id: community.id }, // Replace 2 with the actual community ID value
      group: ['Threads.id'],
      order: [[Sequelize.literal('post_count'), 'DESC']],
    });
    const threadsArray = threadData.slice(0, 3);
    const threads = threadsArray.map((thread) => thread.get({ plain: true }));

//finds the most popular reviews based on the number of plusones and returns the top 3

    const reviewData = await Reviews.findAll({
      order: [['plusones', 'DESC']],
      where: { community_id: community.id }
    });
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

  router.post('/name/:api_id', async (req, res) => {
    console.log(req.params.name)
    try {
      // if (req.session.user_id) {
      // var user = await Users.findOne({
      //   where: {
      //     id: req.session.user_id,
      //   },
      //   attributes: ['name', 'id'], 
      // });
      // } else {
      //   var user;
      // }

      // if (user) {
      //   var currentUserId = user.dataValues.id;
      // } else {
      //   var currentUserId = 0;
      // }
  
    let communityData = await Communities.findOne({ where: { api_id: req.params.api_id } });
    console.log(communityData)
    if (communityData){
      res.redirect(`/community/${communityData.id}`)
    }
    if(communityData === null){ //forward to the post route to create a new community

      //res.redirect('') to post endpoint

      //need id for community
      
      let response = await fetch(`https://api.tvmaze.com/shows/${req.params.api_id}`)
      let shows = await response.json()
      console.log(shows)
      // let show = showEntry.show;
      let [result] = shows.map(showEntry => {
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
         
      };
      return result;
    })
    console.log(result)
    communityData = await Communities.create(result)
    const community = communityData.get({ plain: true });

    const threadData = await Threads.findAll({ where: { id: community.id } });
    const threads = threadData.map((thread) => thread.get({ plain: true }));

    const reviewData = await Reviews.findAll({ where: { id: community.id } });
    const reviews = reviewData.map((thread) => thread.get({ plain: true }));

    // res.render('community', {
    // ...community,
    // threads,
    // reviews,
    // logged_in: req.session.logged_in,
    // current_user_id: currentUserId
    // });
  
    }} catch (err) {
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
  
        res.render('conversations', {threads, community, logged_in: req.session.logged_in })
      
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

      res.render('reviews', {reviews, community, logged_in: req.session.logged_in })
    
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
