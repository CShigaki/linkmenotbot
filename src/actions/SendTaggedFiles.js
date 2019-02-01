import Tag from '../models/Tag';

export const sendFilesTaggedWith = async (bot, msg) => {
  const tag = msg.text;
  var tagModel = await Tag.findByTag(tag);

  if (tagModel.length === 0) {
    bot.sendMessage(msg.chat.id, `No files tagged with ${msg.text} yet.`);

    return;
  }

  tagModel = tagModel[0];
  bot.sendMessage(msg.chat.id, `Sending ${Object.keys(tagModel.fileIdsAndSenders).length} files tagged with ${msg.text}`);

  Object.keys(tagModel.fileIdsAndSenders).map((fileId) => {
    const type = tagModel.fileIdsAndSenders[fileId].type;
    switch (type) {
      case 'photo':
        bot.sendPhoto(msg.chat.id, fileId);
        break;
      case 'video':
        bot.sendVideo(msg.chat.id, fileId);
        break;
      case 'file':
        bot.sendDocument(msg.chat.id, fileId);
        break;
    }
  });
}