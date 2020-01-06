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

  if (message.content.toLowerCase().includes('lmao') && !message.author.bot) {
    message.channel.send('lmao');
  } else if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  } else {
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // If no command with said name, exit early. If there is, get the command and call its run-method while passing in your message and args variables as the method arguments. In case something goes wrong, log the error and report back.
    if (!client.commands.has(commandName)) {
      return;
    }

    const command = client.commands.get(commandName);

    try {
      command.run(client, message, args);
    } catch (error) {
      console.error(error);
      message.reply('There was an error trying to run the command!');
    }
  }
});

client.login(process.env.TOKEN);
