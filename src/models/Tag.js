import mongoose from 'mongoose';

const TagSchema = mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
      unique: true,
    },
    fileIdsAndSenders: {
      type: mongoose.Mixed,
      required: false,
    },
  },
  {
    collection: 'Tag',
  },
);

let TagModel = mongoose.model('Tag', TagSchema);

TagModel.findAll = (callback) => {
  return TagModel.find({}, callback);
}

TagModel.findByTag = (tag) => {
  return TagModel.find({ tag });
}

TagModel.saveTag = (tagToAdd) => {
  return tagToAdd.save();
}

export default TagModel;