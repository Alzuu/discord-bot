const { Client, Collection, RichEmbed } = require('discord.js');
const { config } = require('dotenv');
const client = new Client();

const ytdl = require('ytdl-core');

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

  if (message.content.toLowerCase().includes('lmao') && !message.author.bot) {
    message.channel.send('lmao');
  } else if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  } else if (!message.guild) {
    return;
  } else {
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // If no command with said name, find aliases. If no aliases either, exit early. If there is, get the command and call its run-method while passing in the client, your message and args variables as the method arguments. In case something goes wrong, log the error and report back.

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        cmd => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;

      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
      }

      return message.channel.send(reply);
    }

    try {
      command.run(client, message, args);
    } catch (error) {
      console.error(error);
      message.reply('There was an error trying to run the command!');
    }
  }
});

client.login(process.env.TOKEN);
