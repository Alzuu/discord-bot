const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const client = new Client();

// Colletions
client.commands = new Collection();
client.aliases = new Collection();

config({
  path: __dirname + '/.env'
});

// Runs command-loader
['command'].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.once('ready', () => {
  console.log('Ready!');

  client.user.setPresence({
    status: 'online',
    game: {
      name: 'Allan tinkering me',
      type: 'WATCHING'
    }
  });
});

client.on('message', message => {
  const prefix = '§';

  if (message.author.bot) return;
  if (!message.guild) return;

  if (message.content.toLowerCase().includes('lmao') && !message.author.bot) {
    message.channel.send('lmao');
  }
});

client.login(process.env.TOKEN);
