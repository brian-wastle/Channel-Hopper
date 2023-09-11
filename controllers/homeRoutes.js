const router = require('express').Router();
const { Users, Communities, Reviews, Threads, Posts, CommunityUsers, Plusones } = require('../models');
const Sequelize = require('sequelize');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');


//render the homepage
router.get('/', async (req, res) => {
  try {

    const query = `
    SELECT
        communities.id,
        communities.name,
        communities.image,
        COUNT(threads.id) AS thread_count
    FROM
        communities
    LEFT JOIN
        threads
    ON
        communities.id = threads.community_id
    GROUP BY
        communities.id, communities.name
    ORDER BY
        thread_count DESC;
  `;
  
  let communityData = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
  })
  const communitiesOne = communityData.slice(0, 1);
  const communitiesTwo = communityData.slice(1, 2);

    // find the threads from community 1
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
      const queryOne = `
      SELECT Reviews.id as review_id, Reviews.subject, Reviews.date_created , Users.id , Users.name
FROM Reviews
INNER JOIN Users ON Reviews.user_id = Users.id
WHERE Reviews.community_id = ${communitiesOne[0].id}
ORDER BY Reviews.id DESC
LIMIT 1;
        `;
    
        const [resultsOne, metadataOne] = await sequelize.query(queryOne, {
          type: Sequelize.QueryTypes.SELECT,
        });

    const reviewsCommunityOne = resultsOne;


    //find the reviews from community 2
const queryTwo = `
      SELECT Reviews.id as review_id, Reviews.subject, Reviews.date_created , Users.id , Users.name
FROM Reviews
INNER JOIN Users ON Reviews.user_id = Users.id
WHERE Reviews.community_id = ${communitiesTwo[0].id}
ORDER BY Reviews.id DESC
LIMIT 1;
        `;
    
        const [resultsTwo, metadataTwo] = await sequelize.query(queryTwo, {
          type: Sequelize.QueryTypes.SELECT,
        });

    const reviewsCommunityTwo = resultsTwo;
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
        attributes: ['name', 'id', 'avatarPath'], 
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
          where: { id: req.session.user_id },
        },
      ],
    });
    const communities = commData.map((community) => community.get({ plain: true }));
    console.log(req.session)
//get all user's threads
    const threadData = await Threads.findAll({ where: { user_id: currentUserId } });
    const threads = threadData.map((thread) => thread.get({ plain: true }));
//get all user's reviews
    const reviewData = await Reviews.findAll({ where: { user_id: currentUserId } });
    const reviews = reviewData.map((review) => review.get({ plain: true }));
//render profile with threads and reviews data
    res.render('profile', { 
      user:user.dataValues,
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
          attributes: ['name', 'avatarPath'],
          as: 'user',
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

router.get('/threads/:id', withAuth, async (req, res) => {
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
          attributes: ['name', 'avatarPath'],
          as: 'user',
        },
        {
          model: Communities,
          where: { id: Sequelize.col('Reviews.community_id') }, 
          required: true,
        },
      
      ],
    });

    // const threadData = await Threads.findOne({ where: { id: req.params.id } }, {
      
    // });
    
    const threadQuery = `
  SELECT
    threads.id,
    threads.subject,
    threads.date_created,
    communities.image,
    communities.name,
    users.name as user_name,
    users.id as user_id,
    communities.id as community_id
  FROM threads
  LEFT JOIN users ON threads.user_id = users.id
  LEFT JOIN communities ON threads.community_id = communities.id
  WHERE threads.id = ${req.params.id}
`;

  const thread = await sequelize.query(threadQuery, {
    type: sequelize.QueryTypes.SELECT,
  });



    const authorData = await Users.findOne({
      where: { id: thread[0].user_id },
      attributes: ['name', 'avatarPath'], // Specify the attributes you want to retrieve
    });

    const author = authorData.get({ plain: true });

    // const postData = await Posts.findAll({ where: { thread_id: req.params.id } }, {
    //   include: {
    //     model: Users,
    //     attributes: ['name', 'avatarPath'],
    //     required: true
    //   }});
    //   const posts = postData.map((post) => post.get({ plain: true }));


      const postQuery = `
      SELECT
        posts.id,
        posts.body,
        posts.date_created,
        users.name as user_name
      FROM posts
      LEFT JOIN users ON posts.user_id = users.id
      LEFT JOIN threads ON posts.thread_id = threads.id
      WHERE threads.id = ${req.params.id}
    `;

    const posts = await sequelize.query(postQuery, {
      type: sequelize.QueryTypes.SELECT,
    });

console.log(thread)
    res.render('thread', {
      thread,
      posts,
      author,
      logged_in: req.session.logged_in,
      current_user_id: currentUserId
    });
console.log(posts)
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
