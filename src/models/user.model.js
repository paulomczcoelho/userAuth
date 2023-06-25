const { mongoConnect } = require('../db/db');

BSON = require('mongodb').BSON
const { ObjectId } = require('bson');


module.exports = class User {
  constructor(name, number, email, password, level, status, picture) {
    this.name = name;
    this.number = number;
    this.email = email;
    this.password = password;
    this.level = level;
    this.status = status;
    this.picture = picture;
  }

  async save() {
    const db = await mongoConnect();
    await db.collection('users').insertOne(this);
  }

  static async find() {
    const db = await mongoConnect();
    return await db.collection('users').find().toArray();
  }

  static async deleteById(userId) {
    console.log('Deleting user with ID:', userId);
    try {
      const db = await mongoConnect();
      const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId.BSON) });
      console.log('Delete result:', result);
      return result.deletedCount > 0;
    } catch (error) {
      console.log('Error deleting user:', error);
      throw error;
    }
  }
};