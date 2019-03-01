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

export const tagFile = async (bot, tag, msg) => {
  const messageWithFile = msg.reply_to_message;
  const tagModel = await Tag.findByTag(tag);

  console.log(tagModel);

  const isNew = tagModel.length === 0;
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

  isNew ? createTag(fileId, type, tag, sender, msg, bot) : updateTag(tagModel[0], type, fileId, sender, bot, tag, msg.chat.id);
}

export const isEligibleForTagging = (msg) => {
  const messageReplied = msg.reply_to_message;
  if (messageReplied && (isPhoto(messageReplied) || isVideo(messageReplied) || isFile(messageReplied))) {
    return true;
  }

  return false;
}

const createTag = (fileId, type, tag, sender, msg, bot) => {
  const fileIdsAndSenders = {};
  fileIdsAndSenders[fileId] = {
    type,
    senders: [
      sender,
    ],
  };

  const createdTag = Tag({
    tag,
    fileIdsAndSenders,
  });

  console.log(`Saving new tag ${tag}.`);
  bot.sendMessage(msg.chat.id, `Tagged file with ${tag}`);
  Tag.saveTag(createdTag);
}

const updateTag = (tag, type, fileId, sender, bot, tagName, chatId) => {
  if (tag.fileIdsAndSenders[fileId]) {
    console.log(`Updating tag ${tagName} with new sender.`)

    if (didSenderAlreadyTagThisFile(sender, tag.fileIdsAndSenders[fileId])) {
      bot.sendMessage(chatId, `Tagged file with ${tagName}`);
      // bot.sendMessage(chatId, "You already tagged this file, cunt.");

      return;
    }

    bot.sendMessage(chatId, `Tagged file with ${tagName}`);
    tag.fileIdsAndSenders[fileId].push(sender);
  } else {
    console.log(`Updating tag ${tagName} with new file.`)
    bot.sendMessage(chatId, `Tagged file with ${tagName}`);
    tag.fileIdsAndSenders[fileId] = {
      type,
      senders: [
        sender,
      ],
    }
  }

  Tag.saveTag(Tag(tag));
};

export const didSenderAlreadyTagThisFile = (sender, tagSenderList) => {
  const foundSenderWithSameId = tagSenderList.senders.filter((currentSender) => {
    if (currentSender.id === sender.id) {
      return true;
    }

    return false;
  });

  return foundSenderWithSameId.length === 1;
};
