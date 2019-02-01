import Tag from '../models/Tag';

const isPhoto = (msg) => {
  if (msg.photo) {
    return true;
  }

  return false;
}

const isVideo = (msg) => {
  if (msg.video) {
    return true;
  }

  return false;
}

const isFile = (msg) => {
  if (msg.document) {
    return true;
  }

  return false;
}

export const tagFile = async (bot, msg) => {
  const messageWithFile = msg.reply_to_message;
  const tagModel = await Tag.findByTag(msg.text);

  const isNew = tagModel.length === 0;
  const tagName = msg.text;
  const sender = {
    id: msg.from.id,
    user: (msg.from.username || msg.from.first_name),
  };

  var fileId = '';
  switch (true) {
    case isPhoto(messageWithFile):
      fileId = messageWithFile.photo[messageWithFile.photo.length - 1].file_id;
      break;
    case isVideo(messageWithFile):
      fileId = messageWithFile.video.file_id;
      break;
    case isFile(messageWithFile):
      fileId = messageWithFile.document.file_id;
      break;
  }

  isNew ? createTag(fileId, tagName, sender) : updateTag(tagModel[0], fileId, sender, bot, msg);
}

export const isEligibleForTagging = (msg) => {
  const messageReplied = msg.reply_to_message;
  if (messageReplied && (isPhoto(messageReplied) || isVideo(messageReplied) || isFile(messageReplied))) {
    return true;
  }

  return false;
}

export const createTag = (fileId, tagName, sender) => {
  const fileIdsAndSenders = {};
  fileIdsAndSenders[fileId] = [
    sender,
  ];

  const createdTag = Tag({
    tag: tagName,
    fileIdsAndSenders,
  });

  console.log(`Saving new tag ${tagName}.`);
  Tag.saveTag(createdTag);
}

export const updateTag = (tag, fileId, sender, bot, msg) => {
  console.log(tag);
  console.log(sender);
  if (didSenderAlreadyTagThisFile(sender, tag.fileIdsAndSenders[fileId])) {
    bot.sendMessage(msg.chat.id, "You already tagged this file, cunt.");

    return;
  }

  if (tag.fileIdsAndSenders[fileId]) {
    console.log(`Updating tag ${msg.text} with new sender.`)
    tag.fileIdsAndSenders[fileId].push(sender);
  } else {
    console.log(`Updating tag ${msg.text} with new file.`)
    tag.fileIdsAndSenders[fileId] = [
      sender,
    ];
  }

  console.log(tag);

  Tag.saveTag(tag);
};

export const didSenderAlreadyTagThisFile = (sender, tagSenderList) => {
  const foundSenderWithSameId = tagSenderList.filter((currentSender) => {
    if (currentSender.id === sender.id) {
      return true;
    }

    return false;
  });

  return foundSenderWithSameId.count === 1;
};