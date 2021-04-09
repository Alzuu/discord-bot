const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Tip = require('./../../models/tip.js');


module.exports = {
  name: 'tip',
  category: 'fun',
  description: 'Tip another user',
  run: async (client, message, args) => {
     
    const tipper = message.author;

    const dbURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.obsge.mongodb.net/Discord-bot?retryWrites=true&w=majority`;
    
    
    if (args.length < 1) {
      await message.delete();

      const fetched = await message.channel.messages.fetch({ limit: 1 });
      fetched_message = fetched.first();
      const tipped = fetched_message.author;

      // Make sure you don't tip yourself
      if (tipper.id === tipped.id) {

        message.channel.send('You cannot tip your self :rage:');

      } else {

        mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true })
          .then(async mongoose => {
            try {
              let first_query_result = await Tip.findOne({
                user_id : tipper.id
              }).exec();
              

              if (!first_query_result) {
                
                first_query_result = await new Tip({
                  user_id : tipper.id,
                  points : 0,
                  tips : 3
                }).save();
              }

              let second_query_result = await Tip.findOne({
                user_id : tipped.id
              }).exec();

              if (!second_query_result) {
                second_query_result = await new Tip({
                  user_id : tipped.id,
                  points : 0,
                  tips : 3
                }).save();
              }

              if (first_query_result.tips > 0) {
                
                new_tips = first_query_result.tips - 1
                new_points = second_query_result.points + 50;

                let first_query_update = await Tip.findOneAndUpdate({
                  user_id : tipper.id
                }, {
                  user_id : tipper.id,
                  points : first_query_result.points,
                  tips : new_tips
                }, {
                  new: true
                })
                

                let second_query_update = await Tip.findOneAndUpdate({
                  user_id : tipped.id
                }, {
                  user_id : tipped.id,
                  points : new_points,
                  tips : second_query_result.tips
                }, {
                  new: true
                })
                message.channel.send(`${tipper.toString()} just tipped ${tipped.toString()} 50 :coin:. New balance of ${tipped.toString()} is ${second_query_update.points}.`);

              } else {
                message.channel.send(`You have no tips left! :frowning2:`)
              }
            } finally {
              mongoose.connection.close()
            }
          })
      }

    } else {

      await message.delete();
      const tipped = message.mentions.users.first();

      if (!tipped) {

        const fetched = await message.channel.messages.fetch({ limit: 1 });
        fetched_message = fetched.first();
        tipped = fetched_message.author;

      }

      // Make sure you don't tip yourself
      if (tipper.id === tipped.id) {

        message.channel.send('You cannot tip your self :rage:');

      } else {

        mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true })
          .then(async mongoose => {
            try {
              let first_query_result = await Tip.findOne({
                user_id : tipper.id
              }).exec();
              

              if (!first_query_result) {
                
                first_query_result = await new Tip({
                  user_id : tipper.id,
                  points : 0,
                  tips : 3
                }).save();
              }

              let second_query_result = await Tip.findOne({
                user_id : tipped.id
              }).exec();

              if (!second_query_result) {
                second_query_result = await new Tip({
                  user_id : tipped.id,
                  points : 0,
                  tips : 3
                }).save();
              }

              if (first_query_result.tips > 0) {
                
                new_tips = first_query_result.tips - 1
                new_points = second_query_result.points + 50;

                const first_query_update = await Tip.findOneAndUpdate({
                  user_id : tipper.id
                }, {
                  user_id : tipper.id,
                  points : first_query_result.points,
                  tips : new_tips
                }, {
                  new: true
                })
                

                const second_query_update = await Tip.findOneAndUpdate({
                  user_id : tipped.id
                }, {
                  user_id : tipped.id,
                  points : new_points,
                  tips : second_query_result.tips
                }, {
                  new: true
                })
                message.channel.send(`${tipper.toString()} just tipped ${tipped.toString()} 50 :coin:. New balance of ${tipped.toString()} is ${second_query_update.points}`);

              } else {
                message.channel.send(`You have no tips left! :frowning2:`)
              }
            } finally {
              mongoose.connection.close()
            }
          })
      }
    }
  },
};
