const router = require('express').Router();
const { Users, Communities, Reviews, Threads, Posts, CommunityUsers } = require('../../models');
const withAuth = require('../../utils/auth');


//creates the first post on a new thread
router.post('/', async (req, res) => {
  try {
    const newPost = await Posts.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.redirect('/profile');
  } catch (err) {
    res.status(400).json(err);
  }
});



//create a post on thread ":id", so the :id being passed as a parameter refers to the thread id, not a post id
router.post('/:id', async (req, res) => {
  try {
    const newPost = await Posts.create({
      ...req.body,
      thread_id:req.params.id,
      // user_id: req.session.user_id,
    });

    res.status(200).json('its a hit!');
  } catch (err) {
    res.status(400).json(err);
  }
});


//delete a post at post ":id", so the :id being passed as a paraemeter refers to the post id being destroyed
router.delete('/:id', withAuth, async (req, res) => {
    try {
      const postData = await Posts.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });
  
      if (!postData) {
        res.status(404).json({ message: 'No post found with this id!' });
        return;
      }
  
      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  });









module.exports = router;