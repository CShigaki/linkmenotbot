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

const isGif = (msg) => {
  if (msg.animation) {
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
  var type = '';
  switch (true) {
    case isPhoto(messageWithFile):
      fileId = messageWithFile.photo[messageWithFile.photo.length - 1].file_id;
      type = 'photo';
      break;
    case isVideo(messageWithFile):
      fileId = messageWithFile.video.file_id;
      type = 'video';
      break;
    case isFile(messageWithFile):
      fileId = messageWithFile.document.file_id;
      type = 'file';
      break;
    case isGif(messageWithFile):
      fileId = messageWithFile.animation.file_id;
      type = 'animation';
      break;
  }

  isNew ? createTag(fileId, type, tagName, sender, msg, bot) : updateTag(tagModel[0], fileId, sender, bot, msg);
}

export const isEligibleForTagging = (msg) => {
  const messageReplied = msg.reply_to_message;
  if (messageReplied && (isPhoto(messageReplied) || isVideo(messageReplied) || isFile(messageReplied))) {
    return true;
  }

  return false;
}

export const createTag = (fileId, type, tagName, sender, msg, bot) => {
  const fileIdsAndSenders = {};
  fileIdsAndSenders[fileId] = {
    type,
    senders: [
      sender,
    ],
  };

  const createdTag = Tag({
    tag: tagName,
    fileIdsAndSenders,
  });

  console.log(`Saving new tag ${tagName}.`);
  bot.sendMessage(msg.chat.id, `Tagged file with ${tagName}`);
  Tag.saveTag(createdTag);
}

export const updateTag = (tag, fileId, sender, bot, msg) => {
  if (tag.fileIdsAndSenders[fileId]) {
    console.log(`Updating tag ${msg.text} with new sender.`)

    if (didSenderAlreadyTagThisFile(sender, tag.fileIdsAndSenders[fileId])) {
      bot.sendMessage(msg.chat.id, "You already tagged this file, cunt.");

      return;
    }

    bot.sendMessage(msg.chat.id, `Tagged file with ${msg.text}`);
    tag.fileIdsAndSenders[fileId].push(sender);
  } else {
    console.log(`Updating tag ${msg.text} with new file.`)
    bot.sendMessage(msg.chat.id, `Tagged file with ${msg.text}`);
    tag.fileIdsAndSenders[fileId] = [
      sender,
    ];
  }

  Tag.saveTag(Tag(tag));
};

export const didSenderAlreadyTagThisFile = (sender, tagSenderList) => {
  const foundSenderWithSameId = tagSenderList.filter((currentSender) => {
    if (currentSender.id === sender.id) {
      return true;
    }

    return false;
  });

  return foundSenderWithSameId.length === 1;
};
