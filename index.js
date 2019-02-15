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
  if ('#' === msg.text.charAt(0) && msg.text.length != 1) {
    if (isEligibleForTagging(msg)) {
      tagFile(bot, msg);
    }
    else {
      sendFilesTaggedWith(bot, msg);
    }
  }
});
