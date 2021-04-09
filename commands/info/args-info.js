module.exports = {
  name: 'args-info',
  category: 'info',
  description: 'Information about the arguments provided.',
  usage: '<command> <name> ...',
  args: true,
  run: (client, message, args) => {
    if (args[0] === 'foo') {
      return message.channel.send('bar');
    }

    return message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
  },
};
