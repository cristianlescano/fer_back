import mongoose from 'mongoose';

const connectDb=()=>{
    mongoose.set("strictQuery", false);
    mongoose.connect(
      process.env.MONGODB_URI,
      {useNewUrlParser: true, useUnifiedTopology: true},
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Connected to MongoDB");
        }
      }
    );
}
export default connectDb;