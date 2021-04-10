const mongoose = require('mongoose');
const Tip = require('../../models/tip.js');

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
      const fetchedMessage = fetched.first();
      const tipped = fetchedMessage.author;
      // Make sure you don't tip yourself
      if (tipper.id === tipped.id) {
        message.channel.send('You cannot tip your self :rage:');
      } else {
        mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true })
          .then(async (mongoose) => {
            try {
              let firstQueryResult = await Tip.findOne({
                user_id: tipper.id,
              }).exec();

              if (!firstQueryResult) {
                firstQueryResult = await new Tip({
                  user_id: tipper.id,
                  points: 0,
                  tips: 3,
                }).save();
              }

              let secondQueryResult = await Tip.findOne({
                user_id: tipped.id,
              }).exec();

              if (!secondQueryResult) {
                secondQueryResult = await new Tip({
                  user_id: tipped.id,
                  points: 0,
                  tips: 3,
                }).save();
              }

              if (firstQueryResult.tips > 0) {
                const newTips = firstQueryResult.tips - 1;
                const newPoints = secondQueryResult.points + 50;

                await Tip.findOneAndUpdate({
                  user_id: tipper.id,
                }, {
                  user_id: tipper.id,
                  points: firstQueryResult.points,
                  tips: newTips,
                }, {
                  new: true,
                });

                await Tip.findOneAndUpdate({
                  user_id: tipped.id,
                }, {
                  user_id: tipped.id,
                  points: newPoints,
                  tips: secondQueryResult.tips,
                }, {
                  new: true,
                });
                message.channel.send(`${tipper.toString()} just tipped ${tipped.toString()} 50 :coin:`);
              } else {
                message.channel.send('You have no tips left! :frowning2:');
              }
            } finally {
              mongoose.connection.close();
            }
          });
      }
    } else {
      await message.delete();
      const tipped = message.mentions.users.first();

      if (!tipped) {
        message.channel.send('Invalid armgument!');
        return;
      }

      // Make sure you don't tip yourself
      if (tipper.id === tipped.id) {
        message.channel.send('You cannot tip your self :rage:');
      } else {
        mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true })
          .then(async (mongoose) => {
            try {
              let firstQueryResult = await Tip.findOne({
                user_id: tipper.id,
              }).exec();

              if (!firstQueryResult) {
                firstQueryResult = await new Tip({
                  user_id: tipper.id,
                  points: 0,
                  tips: 3,
                }).save();
              }

              let secondQueryResult = await Tip.findOne({
                user_id: tipped.id,
              }).exec();

              if (!secondQueryResult) {
                secondQueryResult = await new Tip({
                  user_id: tipped.id,
                  points: 0,
                  tips: 3,
                }).save();
              }

              if (firstQueryResult.tips > 0) {
                const newTips = firstQueryResult.tips - 1;
                const newPoints = secondQueryResult.points + 50;

                await Tip.findOneAndUpdate({
                  user_id: tipper.id,
                }, {
                  user_id: tipper.id,
                  points: firstQueryResult.points,
                  tips: newTips,
                });

                await Tip.findOneAndUpdate({
                  user_id: tipped.id,
                }, {
                  user_id: tipped.id,
                  points: newPoints,
                  tips: secondQueryResult.tips,
                });
                message.channel.send(`${tipper.toString()} just tipped ${tipped.toString()} 50 :coin:. New balance of ${tipped.toString()} is ${secondQueryResult.points}`);
              } else {
                message.channel.send('You have no tips left! :frowning2:');
              }
            } finally {
              mongoose.connection.close();
            }
          });
      }
    }
  },
};
