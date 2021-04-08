const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'topgif',
  category: 'fun',
  description: 'Post a random gif from tenor',
  run: async (client, message, args) => {
     
    const fetch = require('node-fetch');

    // Tenor API key
    const apikey = process.env.TENOR;

    // Check if the args are empty, if so post a random gif of pandas from the top 30 results
    // Otherwise search and choose a random gif from the top 30 results
    if (args.length < 1) {
      await message.delete();

      const fetched = await message.channel.messages.fetch({ limit: 1 });

      const url = `https://g.tenor.com/v1/search?q=${fetched.first()}&key=${apikey}&limit=1`;
      const response = await fetch(url);
      const json = await response.json();

      const msg = await message.channel.send(json.results[0].url);

    } else {
       
      const url = `https://g.tenor.com/v1/search?q=${args.join('_')}&key=${apikey}&limit=1`;
      const response = await fetch(url);
      const json = await response.json();

      const msg = await message.channel.send(json.results[0].url);
    
    }
  },
};
