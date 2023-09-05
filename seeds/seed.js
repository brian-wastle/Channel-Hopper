const sequelize = require('../config/connection');
const { Users, Communities, Threads, Posts, CommunityUsers} = require('../models');

const userData = require('./userData.json');
const communityData = require('./communityData.json');
const threadsData = require('./threadsData.json');
const postsData = require('./postsData.json');
const cuData = require('./communityUsersData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await Users.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const communities = await Communities.bulkCreate(communityData, {
    individualHooks: true,
    returning: true,
  });
  
  const threads = await Threads.bulkCreate(threadsData, {
    individualHooks: true,
    returning: true,
  });

  const posts = await Posts.bulkCreate(postsData, {
    individualHooks: true,
    returning: true,
  });


  const communityusers = await CommunityUsers.bulkCreate(cuData, {
    individualHooks: true,
    returning: true,
  });


  process.exit(0);
};

seedDatabase();
