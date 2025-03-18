/**
 * MongoDB configuration for the InstantIEP application
 */

require('dotenv').config();

const { MongoClient } = require('mongodb');

// Use environment variable for the connection string
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/instantiep';

// MongoDB client
let client = null;

// Database reference
let db = null;

/**
 * Connect to the MongoDB database
 */
async function connect() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    db = client.db('instantiep');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Close the MongoDB connection
 */
async function close() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

/**
 * Get the database instance
 */
function getDb() {
  if (!db) {
    throw new Error('Database not connected. Call connect() first.');
  }
  return db;
}

module.exports = {
  connect,
  close,
  getDb
};