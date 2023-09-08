const router = require('express').Router();
const { Users, Communities, Reviews, Threads, Posts, CommunityUsers, Plusones } = require('../../models');
const Sequelize = require('sequelize');
const withAuth = require('../../utils/auth');

//create a review
router.post('/', async (req, res) => {
    try {
      const newReview = await Reviews.create({
        ...req.body,
        user_id: req.session.user_id,
        plusones: 0
      });
    
      const reviewData = await Reviews.findAll({
        attributes: [
        [Sequelize.fn('max', Sequelize.col('id')), 'id']],
        raw: true,
        
      });
      // access first item in the array returned by Sequelize
      const newReviewId = reviewData[0];
      
      if (newReviewId) {
        res.json(newReviewId);
      } else {
        res.status(404).json({ message: 'No threads found' });
      }



      res.status(200).json(newReview);
    } catch (err) {
    }
  });


//add a plusone to a review
router.put('/:id/plusone', withAuth, async (req, res) => {
    try {
        console.log('so far so good?')
        const plusOnesValue = await Reviews.findOne({ where: { id: req.params.id } });

        if (!plusOnesValue) {
        return res.status(404).json({ error: 'Review not found' });
        }
        // Increment the value by 1
        plusOnesValue.plusones += 1;

        console.log('not bad')
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
        console.log('lets go')
        const newReview = await Plusones.create({
          ...req.body,
          user_id: req.session.user_id,
          review_id:req.params.id,
        });
        res.status(200).json(plusOnesValue);
        // document.location.replace(`/reviews/${req.params.id}`);
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