const { Client, Collection } = require('discord.js');
const cron = require('cron');
const Tip = require('./models/tip.js');
const mongoose = require('mongoose');

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
      name: 'Allu doing tiktok dances',
      type: 'WATCHING',
    },
  });
});

client.on('message', async (message) => {
  // Set prefix
  const prefix = '!';

  // Allu bait & check that the author of the message is not the bot itself
  if (!message.content.startsWith(prefix) && message.content.includes('free')) return message.channel.send('allu thats toxic');
  if (!message.content.startsWith(prefix) && message.content.trim().toLowerCase() === "fuck you dolphin") return message.channel.send('FUCK YOU WHALE');
  if (!message.content.startsWith(prefix) || message.author.bot) return;

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

    message.channel.send(reply);
  }

  // If all before apply, run command
  try {
    command.run(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to run the command!');
  }
});

client.login(process.env.TOKEN);

let tip_filler = new cron.CronJob('00 00 20 * * *', () => {
  // This runs every day at 20:00:00, you can do anything you want
  
  const dbURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.obsge.mongodb.net/Discord-bot?retryWrites=true&w=majority`;
  mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true })
          .then(async mongoose => {
            try {
              const res = await Tip.updateMany({},
                {tips : 3})
            } finally {
              mongoose.connection.close()
            }
          })
});

tip_filler.start()