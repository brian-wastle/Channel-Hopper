const sequelize = require('../config/connection');
const { Users, Communities, Threads, Posts, Calendars, CommunityUsers, Reviews } = require('../models');

const userData = require('./userData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await Users.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });


  process.exit(0);
};

seedDatabase();
