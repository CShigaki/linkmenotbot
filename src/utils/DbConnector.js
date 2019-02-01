import Mongoose from 'mongoose';

Mongoose.Promise = global.Promise;

const connectToDb = async () => {
    try {
        await Mongoose.connect(`mongodb://127.0.0.1:27017/LinkMeNot`);
        console.log('Connected to mongo!!!');
    }
    catch (err) {
        console.log('Could not connect to MongoDB');
    }
}

export default connectToDb;