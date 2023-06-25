const bcrypt = require('bcrypt');
const db = require('../db/db');

const User = require('../models/user.model');




// Obtém todos os usuários
async function getAllUsers() {
  const collection = getCollection();
  const users = await collection.find().toArray();
  return users;
}

// Obtém um usuário pelo ID
async function getUserById(id) {
  const collection = getCollection();
  const user = await collection.findOne({ _id: id });
  return user;
}

// Obtém um usuário pelo email
async function getUserByEmail(email) {
  const collection = getCollection();
  const user = await collection.findOne({ email });
  return user;
}

// Cria um novo usuário
async function createUser(name, email, password) {
  const collection = getCollection();
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { name, email, password: hashedPassword };
  await collection.insertOne(user);
}

// Atualiza um usuário
async function updateUser(id, name, email, password) {
  const collection = getCollection();
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { name, email, password: hashedPassword };
  await collection.updateOne({ _id: id }, { $set: user });
}

// Deleta um usuário
async function deleteUser(id) {
  const collection = getCollection();
  await collection.deleteOne({ _id: id });
}

// module.exports = {
//   getAllUsers,
//   getUserById,
//   getUserByEmail,
//   createUser,
//   updateUser,
//   deleteUser,
// };
