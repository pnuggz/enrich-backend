import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const config = {
  port: process.env.PORT,
  
  logs: {
    level: process.env.LOG_LEVEL || 'silly'
  },

  api: {
    prefix: '/api'
  }
}

export default config