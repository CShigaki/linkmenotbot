import Tag from '../models/Tag';

export const sendFilesTaggedWith = async (bot, tag, chatId, chatType) => {
  var tagModel = await Tag.findByTag(tag);

  if (tagModel.length === 0) {
    bot.sendMessage(chatId, `No files tagged with ${tag} yet.`);

    return;
  }

  tagModel = tagModel[0];
  const numberOfFiles = Object.keys(tagModel.fileIdsAndSenders).length;
  var numberOfFilesToSend = numberOfFiles;
  var message = `Sending ${numberOfFilesToSend} files tagged with ${tag}.`;

  if ('group' === chatType || 'supergroup' === chatType) {
    numberOfFilesToSend = 5;
    message = `Sending ${numberOfFilesToSend} of ${numberOfFiles} files tagged with ${tag}\n\nIf you want to see all files tagged with this hashtag, send me a private message with the hashtag.`;
  }

  bot.sendMessage(chatId, message)
    .then(async () => {
      const fileIds = Object.keys(tagModel.fileIdsAndSenders);
      for (var index = 0; index < numberOfFilesToSend; index++) {
        if (index !== 0 && index % 20 === 0) {
          // console.log(`File number ${index}. Applying delay`);
          await delay(10000);
        }

        const fileId = fileIds[index];
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
      }
    });
}

const delay = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};