const { Client, Collection } = require('discord.js');
const cron = require('cron');
const mongoose = require('mongoose');
const Tip = require('./models/tip.js');

require('dotenv').config();

const client = new Client();

// Collections
client.commands = new Collection();
client.aliases = new Collection();

// Initialize command handler
require('./commands')(client);

client.once('ready', () => {
  console.log('Ready!');

  client.user.setPresence({
    status: 'online',
    activity: {
      name: 'the devs doing their best',
      type: 'WATCHING',
    },
  });
});

client.on('message', async (message) => {
  // Set prefix
  const prefix = '!';

  // Check that the author of the message is not the bot itself
  if (!message.content.startsWith(prefix) && message.content.includes('free'))
    return message.channel.send('allu thats toxic');

  // Format the input
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Check whether command is valid
  const command = client.commands.get(commandName);

  if (!command) return;

  // Check that the arguments are valid
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // If all before apply, run command
  try {
    return command.run(client, message, args);
  } catch (e) {
    console.error(e);
    return message.reply('There was an error trying to run the command!');
  }
});

client.login(process.env.TOKEN);

const tipFiller = new cron.CronJob('00 00 20 * * *', () => {
  // This runs every day at 20:00:00, you can do anything you want

  const dbURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.obsge.mongodb.net/Discord-bot?retryWrites=true&w=majority`;
  mongoose
    .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async (mongoose) => {
      try {
        await Tip.updateMany({}, { tips: 3 });
      } finally {
        mongoose.connection.close();
      }
    });
});

tipFiller.start();
