const router = require('express').Router();
const { Users, Communities, Reviews, Threads, Posts, CommunityUsers } = require('../models');
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

    const threadData = await Threads.findAll({ where: { id: community.id } });
    const threads = threadData.map((thread) => thread.get({ plain: true }));

    const reviewData = await Reviews.findAll({ where: { id: community.id } });
    const reviews = reviewData.map((thread) => thread.get({ plain: true }));

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



module.exports = router;