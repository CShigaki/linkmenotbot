export const handleStart = (bot, msg) => {
  var message = "Hello!\n";
  message += "My purpose is to tag and send media/files whenever you ask for it.\n\n";
  message += "If you want to tag something you just need to:\n\n";
  message += "1. Add me in the group where the file/media you want to tag is OR send it to me via private message\n";
  message += "2. Reply to the file/media with a hashtag and it's done\n\n";
  message += "If you want to A LOT of content, it could be very time consuming to tag each file individually, in this can you can\n";
  message += "1. Set a hashtag as your last name\n"
  message += "If you do that, all files you send me will be automatically tagged with that hashtag.\n\n"
  message += "Whenever you want me to send the files you tagged, you just need to type the hashtag you used to tag them.\n\n";
  message += "The owner of this bot does not take responsibility for what is tagged. Every file tagged is responsibility of who tagged it, so be aware of what you tag.\n\n";

  bot.sendMessage(msg.chat.id, message)
}
