const router = require('express').Router();
const { Users, Communities, Reviews, Threads, Posts, CommunityUsers } = require('../../models');
const withAuth = require('../../utils/auth');

//create a review
router.post('/', withAuth, async (req, res) => {
    try {
      const newReview = await Reviews.create({
        ...req.body,
        user_id: req.session.user_id,
      });
  
      res.status(200).json(newReview);
    } catch (err) {
      res.status(400).json(err);
    }
  });


//add a plusone to a review
router.put('/:id/plusone', withAuth, async (req, res) => {
    try {

        const plusOnesValue = await Reviews.findOne({ where: { id: req.params.id } });

        if (!plusOnesValue) {
        return res.status(404).json({ error: 'Review not found' });
        }
        // Increment the value by 1
        plusOnesValue.plusones += 1;


        const reviewData = await Reviews.update(
        {
            plusones: plusOnesValue.plusones
        }, 
        {
            where: {
            id: req.params.id,
            }
        }
        );
  
      return res.status(200).json(reviewData);
    } catch (err) {
      res.status(400).json(err);
    }
  });







//delete a review
router.delete('/:id', withAuth, async (req, res) => {
    try {
      const reviewData = await Reviews.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });
  
      if (!reviewData) {
        res.status(404).json({ message: 'No review found with this id!' });
        return;
      }
  
      res.status(200).json(reviewData);
    } catch (err) {
      res.status(500).json(err);
    }
  });



module.exports = router;