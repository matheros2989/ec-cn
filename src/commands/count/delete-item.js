const { Client, Message, MessageEmbed } = require('discord.js');
const Items = require('../../schema/Shop');

  module.exports = {
      name: 'delete-item',
      category: 'Configuration',
      description: 'Allows you to delete an item for the shop',
      usage: '<item>',
      permissions: 'MANAGE_MESSAGES',
      /** 
       * @param {Client} client 
       * @param {Message} message 
       * @param {String[]} args 
       */
      run: async(client, message, args) => {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You do not have permission to do this command!');
          const item_name = args[0];

          if(!item_name) return message.reply('Please enter a name!');

          Items.deleteOne({
            id: message.guild.id,
            name: item_name
          }, async(err, data) => {
            if(err) throw err;

            message.channel.send(`The item ${item_name} has been removed from the shop!`);
          })
      }
    }
