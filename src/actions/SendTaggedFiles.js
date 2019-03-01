import Tag from '../models/Tag';

export const sendFilesTaggedWith = async (bot, tag, chatId) => {
  var tagModel = await Tag.findByTag(tag);

  if (tagModel.length === 0) {
    bot.sendMessage(chatId, `No files tagged with ${tag} yet.`);

    return;
  }

  tagModel = tagModel[0];
  bot.sendMessage(chatId, `Sending ${Object.keys(tagModel.fileIdsAndSenders).length} files tagged with ${tag}`)
    .then(() => {
      Object.keys(tagModel.fileIdsAndSenders).map((fileId) => {
        const type = tagModel.fileIdsAndSenders[fileId].type;
        switch (type) {
          case 'photo':
            bot.sendPhoto(chatId, fileId);
            break;
          case 'video':
            bot.sendVideo(chatId, fileId);
            break;
          case 'file':
            bot.sendDocument(chatId, fileId);
            break;
        }
      });
    });
}