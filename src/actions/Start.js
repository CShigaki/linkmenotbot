export const handleStart = (bot, msg) => {
  var message = "Hello!\n";
  message += "My purpose is to tag and send media/files whenever you ask for it.\n\n";
  message += "If you want to tag something you just need to:\n\n";
  message += "1. Add me in the group where the file/media you want to tag is OR send it to me via private message\n";
  message += "2. Reply to the file/media with a hashtag and it's done\n\n";
  message += "Whenever you want me to send the files you tagged, you just need to type the hashtag you used to tag them.\n\n";
  message += "If you have any suggestions or feature requests, message @celsao.\n";
  message += "Also, ffs don't tag cp. Thank you.";

  bot.sendMessage(msg.chat.id, message)
}
