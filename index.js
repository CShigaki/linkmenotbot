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
  let tag = msg.text.split(' ')[0];
  if ('#' === tag.charAt(0) && tag != 1) {
    if (isEligibleForTagging(msg)) {
      tagFile(bot, tag, msg);
    }
    else {
      sendFilesTaggedWith(bot, tag, msg.chat.id);
    }
  }
});
