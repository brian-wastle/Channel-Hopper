const Users = require('./Users');
const Communities = require('./Communities');
const Threads = require('./Threads');
const Posts = require('./Posts');
const Calendars = require('./Calendars');
const Reviews = require('./Reviews');
const CommunityUsers = require('./CommunityUsers');

//users / communities
Users.belongsToMany(Communities, { 
  foreignKey: 'user_id', 
  through: CommunityUsers, 
  unique: false 
});

Communities.belongsToMany(Users, { 
  foreignKey: 'community_id', 
  through: CommunityUsers, 
  unique: false 
});


// users / calendars
Users.hasOne(Calendars, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Calendars.belongsTo(Users, {
  foreignKey: 'user_id',
});


//calendars/communities
Calendars.belongsToMany(Communities, { 
  foreignKey: 'community_id', 
  through: CommunityUsers, 
  unique: false 
});

Communities.belongsToMany(Calendars, { 
  foreignKey: 'community_id', 
  through: CommunityUsers, 
  unique: false 
});


//communities / threads
Communities.hasMany(Threads, {
  foreignKey: 'community_id',
  onDelete: 'CASCADE'
});

Threads.belongsTo(Communities, {
  foreignKey: 'community_id'
});


//threads/ posts
Threads.hasMany(Posts, {
  foreignKey: 'thread_id',
  onDelete: 'CASCADE'
});

Posts.belongsTo(Threads, {
  foreignKey: 'thread_id',
});


//communities/ reviews
Communities.hasMany(Reviews, {
  foreignKey: 'community_id',
  onDelete: 'CASCADE'
});

Reviews.belongsTo(Communities, {
  foreignKey: 'community_id',
});



module.exports = { Users, Communities, CommunityUsers, Threads, Posts, Calendars, Reviews};
