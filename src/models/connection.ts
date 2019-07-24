import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let connectionString: any;

// set connection for different environment
switch (process.env.NODE_ENV) {
  case "production":
    connectionString = process.env.MONGO_PRODUCTION;
    break;
  case "development":
    connectionString = process.env.MONGO_DEVELOPMENT;
    break;
  case "test":
    connectionString = process.env.MONGO_TEST;
    break;
  default:
    throw new Error("Specify a valid process.env.NODE_ENV");
}

// connect to mongoDB server
const connection = mongoose
  .connect(connectionString, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log(`connected to ${process.env.NODE_ENV} database`))
  .catch(err => console.log(err));

export const dropDB = async () => {
  await mongoose.connection.db.dropDatabase();
  mongoose.connection.close();
};

export default connection;
