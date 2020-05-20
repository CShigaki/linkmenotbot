import 'babel-polyfill';

import connectToDb from './src/utils/DbConnector';

import { handleStart } from './src/actions/Start';
import { isEligibleForTagging, tagFile } from './src/actions/TagFile';
import { sendFilesTaggedWith } from './src/actions/SendTaggedFiles';

connectToDb();

const TelegramBot = require('node-telegram-bot-api');
const token = 'Token Bitch';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/i, (msg) => {
  handleStart(bot, msg);
});

bot.onText(/\/help/i, (msg) => {
  handleStart(bot, msg);
});

bot.on('message', (msg) => {
  const hasTagAsLastName = msg.from.last_name && '#' === msg.from.last_name.charAt(0);
  if (hasTagAsLastName && isEligibleForTagging(msg, true)) {
    if (msg.media_group_id) {
      return bot.sendMessage(msg.chat.id, "I see you're trying to bulk tag pictures sending as an album. Sadly, if you want to bulk tag you must send the files as separate media.");
    }

    let tag = msg.from.last_name.split(' ')[0];
    tagFile(bot, tag, msg, true);

    return;
  }

  if (msg.text) {
    let tag = msg.text.split(' ')[0];
    if ('#' === tag.charAt(0) && tag != 1) {
      if (isEligibleForTagging(msg, false)) {
        tagFile(bot, tag, msg, false);
      }
      else {
        if (msg.chat.type !== 'private') {
          return bot.sendMessage(msg.chat.id, "To avoid flooding, this function is disabled for group chats and can only be used in a private conversation with me.");
        }

        sendFilesTaggedWith(bot, tag, msg.chat.id, msg.chat.type);
      }
    }
  }
});
