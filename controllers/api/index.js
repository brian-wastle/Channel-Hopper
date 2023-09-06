const router = require('express').Router();
const userRoutes = require('./userRoutes');
const reviewRoutes = require('./reviewRoutes');
const threadRoutes = require('./threadRoutes');


router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/threads', threadRoutes);


module.exports = router;
