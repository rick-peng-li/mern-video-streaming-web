const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { User } = require('../../db/collections');
const logger = require('../../../logger');

const SALT_ROUNDS = 10;

const insert = async (user) => {
  try {
    const existingUser = await User.findOne({ email: user.email, isDeleted: false });
    if (existingUser) {
      return new Error(JSON.stringify({ status: 'error', message: 'Email already exists' }));
    }
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    const item = {
      isActive: true,
      ...user,
      password: hashedPassword,
    };
    return await User.insert(item);
  } catch (error) {
    logger.error(error);
    return error;
  }
};

const authenticate = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email, isDeleted: false, isActive: true });
    if (!user) {
      return new Error(JSON.stringify({ status: 'error', message: 'Invalid email or password' }));
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return new Error(JSON.stringify({ status: 'error', message: 'Invalid email or password' }));
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    logger.error(error);
    return error;
  }
};

const update = async (user) => {
  try {
    const { password, ...rest } = user;
    const updateData = { ...rest };
    if (password) {
      updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
    }
    return await User.update(updateData);
  } catch (error) {
    logger.error(error);
    return error;
  }
};

const search = async (searchObject) => {
  const filter = searchObject.keyword
    ? {
        $or: [
          { name: new RegExp(searchObject.keyword, 'i') },
          { email: new RegExp(searchObject.keyword, 'i') },
        ],
        isDeleted: false,
      }
    : {
        isDeleted: false,
      };

  const projection = {
    name: 1,
    email: 1,
    roleId: 1,
    avatarUrl: 1,
    isActive: 1,
    createdAt: 1,
  };

  const pageNumber = searchObject.pageNumber || 1;
  const limit = searchObject.limit || 10;
  const sort = searchObject.sort || { createdAt: -1 };

  const users = await User.search({
    filter,
    projection,
    sort,
    pageNumber,
    limit,
  });
  return users;
};

const count = async (searchObject) => {
  const filter = searchObject.keyword
    ? {
        $or: [
          { name: new RegExp(searchObject.keyword, 'i') },
          { email: new RegExp(searchObject.keyword, 'i') },
        ],
        isDeleted: false,
      }
    : {
        isDeleted: false,
      };
  return await User.count({ filter });
};

module.exports = {
  insert,
  update,
  authenticate,
  search,
  count,
  getById: User.getObjectById,
  deleteById: User.deleteById,
};
