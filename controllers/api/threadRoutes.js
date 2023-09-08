const router = require('express').Router();
const { Users, Communities, Reviews, Threads, Posts, CommunityUsers } = require('../../models');
const Sequelize = require('sequelize');
const withAuth = require('../../utils/auth');

//create a thread
router.post('/', async (req, res) => {
    try {
//grab the url, split it into parts on the forward slashes, grab the id from the 3rd index of the new array
      
      const newThread = await Threads.create({
        ...req.body,
        user_id: req.session.user_id,
      });

      res.status(200).json(newThread);
    } catch (err) {
      res.status(400).json(err);
    };
  });

  //immediately grab the latest thread to associate the first post with that thread
  router.get('/threadid', async (req, res) => {
    try {
      const threadData = await Threads.findAll({
        attributes: [
          [Sequelize.fn('max', Sequelize.col('id')), 'thread_id']
        ],
        raw: true,
      });
      
      // Sequelize sends back array
      const thread = threadData[0];

      if (thread) {
        res.redirect(`threads/${thread}`); //this needs to be updated
      } else {
        res.status(404).json({ message: 'No threads found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


//delete a thread
router.delete('/:id', withAuth, async (req, res) => {
    try {
      const threadData = await Threads.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });

      const postData = await Posts.destroy({
        where: {
          thread_id: req.params.id,
          user_id: req.session.user_id,
        },
      });
  
      if (!threadData) {
        res.status(404).json({ message: 'No thread found with this id!' });
        return;
      }
  
      res.status(200).json(threadData);
    } catch (err) {
      res.status(500).json(err);
    }
  });









module.exports = router;