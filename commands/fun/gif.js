//require('dotenv').config();

const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'gif',
  category: 'fun',
  description: 'Post a random gif from tenor',
  run: async (client, message, args) => {
     
    const fetch = require('node-fetch');

    // Tenor API key
    const apikey = process.env.TENOR;

    // Check if the args are empty, if so post a random gif of pandas from the top 30 results
    // Otherwise search and choose a random gif from the top 30 results
    if (args.length < 1) {

      const url = `https://g.tenor.com/v1/search?q=panda&key=${apikey}&limit=50`;
      const response = await fetch(url);
      const json = await response.json();

      let rndm = Math.floor(Math.random() * 28) + 1

      const msg = await message.channel.send(json.results[rndm].url);

    } else {
       
      const url = `https://g.tenor.com/v1/search?q=${args.join('_')}&key=${apikey}&limit=50`;
      const response = await fetch(url);
      const json = await response.json();

      let rndm = Math.floor(Math.random() * 28) + 1

      const msg = await message.channel.send(json.results[rndm].url);
    
    }
  },
};
