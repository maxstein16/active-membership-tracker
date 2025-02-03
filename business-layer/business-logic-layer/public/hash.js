const bcrypt = require("bcrypt");

/**
 * Hashes a given password using bcrypt.
 * This function takes a plain-text password, generates a salt, and returns the hashed version of the password.
 * @param {string} password - The plain-text password to be hashed.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

module.exports = hashPassword;
