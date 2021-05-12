const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'poll',
  category: 'fun',
  description: 'Create a simple poll',
  usage: '<command> <title>, <command>',
  run: async (client, message, args) => {
    // Addition of reactions
    const addReactions = async (msg) => {
      await msg.react('👍');
      await msg.react('👎');
    };

    // Check if the args are empty, if so delete this message and look at the latest one,
    // otherwise create a new message with the poll determined by args
    // Then add reactions to the latest message
    try {
      if (args.length < 1) {
        await message.delete();

        const fetched = await message.channel.messages.fetch({ limit: 1 });
        if (fetched && fetched.first()) await addReactions(fetched.first());
      } else {
        const question = args.join(' ');
        const embed = new MessageEmbed()
          .setColor('#F2F251')
          .setTitle(question)
          .setDescription('React with 👍 or 👎')
          .setTimestamp();
        const msg = await message.channel.send(embed);
        await addReactions(msg);
      }
    } catch (e) {
      console.error(e);
    }
  },
};
