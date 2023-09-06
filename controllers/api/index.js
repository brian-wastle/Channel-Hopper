const router = require('express').Router();
const userRoutes = require('./userRoutes');
const reviewRoutes = require('./reviewRoutes');
const threadRoutes = require('./threadRoutes');
const postRoutes = require('./postRoutes');


router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/threads', threadRoutes);
router.use('/posts', postRoutes);

module.exports = router;
