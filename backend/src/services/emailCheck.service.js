const emailExistence = require("email-existence");

exports.checkEmailExists = (email) => {
  return new Promise((resolve) => {
    emailExistence.check(email, (err, exists) => {
      if (err) return resolve(false);
      resolve(exists);
    });
  });
};
