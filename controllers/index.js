const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const communityRoutes = require('./communityRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/community', communityRoutes);

module.exports = router;
