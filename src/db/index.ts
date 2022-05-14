import mongoose from 'mongoose';
import { MONGODB_CONNECTION_STRING } from '../config';

const connectionString = MONGODB_CONNECTION_STRING

export default async function connect() {
  const doConnect = async () => {
      try {
        await mongoose.connect(connectionString)
        return console.info(`Successfully connected to ${connectionString}`);
      } catch (error) {
        console.error('Error connecting to database: ', error);
        return process.exit(1);
      }
  };

  mongoose.connection.on('disconnected', doConnect);

  await doConnect();
};