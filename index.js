const { Client, Collection } = require('discord.js');

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
