const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const communityRoutes = require('./communityRoutes');
const searchRoutes = require('./searchRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/community', communityRoutes);
router.use('/search', searchRoutes);

module.exports = router;
