const session = require("express-session");
const { User } = require("../models");

module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
  verify_author: (author, user, options) => {
    if (author == user) {
      console.log('same');
      return options.fn(this);
    }
    console.log('not the same');
    return options.inverse(this);
  },
};
// {{!-- verifies if the author is the same as the user accessing the blog, and then uses the comment partial, or not --}}
// {{#verify_author author_id user_id}}

// {{else}}

// {{/verify_author}}