const { Client, Message, MessageEmbed } = require('discord.js');
const Items = require('../../schema/Shop');

  module.exports = {
      name: 'set-item',
      category: 'Configuration',
      description: 'Allows you to define an item for the shop',
      usage: '<item> <price> <description>',
      permissions: 'MANAGE_MESSAGES',
      /** 
       * @param {Client} client 
       * @param {Message} message 
       * @param {String[]} args 
       */
      run: async(client, message, args) => {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You do not have permission to do this command!');
          const item_name = args[0];
          const item_price = args[1];
          const item_description = args.slice(2).join(' ');

          if(!item_name) return message.reply('Please enter a name!');
          if(!item_price) return message.reply('Please put a price!');
            if(!item_description) return message.reply('Please put a description!');

          Items.findOne({
            id: message.guild.id,
          }, async(err, data) => {
            if(err) throw err;
              data = new Items({
                id: message.guild.id,
                name: item_name,
                price: item_price,
                description: item_description
              })

            data.save();
            message.channel.send(`Item ${item_name} (${item_price} price) has been successfully added to the shop!`);
          })
      }
    }
