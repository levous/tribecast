import mongoose from 'mongoose';
import config from 'config';

const MONGO_URI = config.get('dbUri')

export function tearDown(){
  mongoose.models = {};
  mongoose.modelSchemas = {};
  resetDb();
  if(mongoose.connection.readyState) mongoose.disconnect();
}

export function setUp(){
  if(!mongoose.connection.readyState) mongoose.connect(MONGO_URI);
}

export function resetDb(){
  if(mongoose.connection.db) mongoose.connection.db.dropDatabase();
}
