/**
 * This is the basic command layout
 * module.exports = {
 *  name: "Command name",
 *  aliases: ["array", "of", "aliases"]
 *  category: "Category name",
 *  description: "Command description"
 *  usage: "[args input]",
 *  run: (client, message, args) => {
 *      The code in here to execute
 *  }
 * }
 */

const { readdirSync } = require('fs');

const ascii = require('ascii-table');

// Creates new empty ascii table
const table = new ascii('Commands');
table.setHeading('Folder', 'Command', 'Status');

module.exports = (client) => {
  // Read every commands subfolder
  readdirSync('./commands/').forEach((dir) => {
    // Filter .js command files
    const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith('.js'));
    commands.forEach((command) => {
      const pull = require(`./commands/${dir}/${command}`);

      if (pull.name) {
        client.commands.set(pull.name, pull);
        table.addRow(dir, pull.name, '✅');
      } else {
        table.addRow(dir, pull.name, '❌');
      }

      // If there's an aliases key, read the aliases.
      if (pull.aliases && Array.isArray(pull.aliases)) {
        pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
      }
    });
  });
  // eslint-disable-next-line no-console
  console.log(table.toString());
};
