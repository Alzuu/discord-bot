const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Shows a table with all the available commands or info about a specific command.',
  category: 'info',
  aliases: ['h', 'commands'],
  usage: '<command>, <command> <name>',
  cooldown: 3,
  run: async (client, message, args) => {
    const { commands } = await client;
    const embed = new MessageEmbed();
    const data = [];

    if (!args.length) {
      commands.forEach((value) => {
        const { name } = value;
        data.push(name);
      });
      embed
        .setColor('#F2F251')
        .setTitle('🤖 Beep boop providing commands')
        .setDescription(`${data.join('\n')}\n\nType !help <command> for command-specific info!`)
        .setTimestamp();
    } else {
      const command = commands.get(args[0]);
      embed
        .setColor('#F2F251')
        .setTitle(`Command: ${command.name}`)
        .setDescription(command.description)
        .addFields(
          { name: 'Category', value: command.category },
          { name: 'Usage', value: command.usage },
        )
        .setTimestamp();
    }
    return message.channel.send(embed);
  },
};
