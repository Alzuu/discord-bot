module.exports = {
  name: 'ping',
  category: 'info',
  description: 'Shows latency and API ping',
  run: async (client, message) => {
    const msg = await message.channel.send('🏓 Pinging...');

    await msg.edit(`🏓 Pong!\nPing: ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms\nBot latency: ${Math.round(client.ws.ping)}ms`);
  },
};
