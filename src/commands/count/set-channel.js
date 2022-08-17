const { Client, Message } = require('discord.js');
const Guild = require('../../schema/Guild');
  module.exports = {
      name: 'set-channel',
      category: 'Configuration',
      description: 'Allows you to set the counting salon',
      usage: '<channel>',
      permissions: 'MANAGE_MESSAGES',
      /** 
       * @param {Client} client 
       * @param {Message} message 
       * @param {String[]} args 
       */
      run: async(client, message, args) => {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You do not have permission to do this command!');
        const channel = message.mentions.channels.first();
        if(!channel) return message.reply('Please mention a channel!');
        Guild.findOne({
          id: message.guild.id,
        }, async(err, data) => {
          if(err) throw err;
          if(data) {
            data.Channel = channel.id;
          } else {
            data = new Guild({
              id: message.guild.id,
              Current: 0,
              Channel: channel.id
            })
          }
          data.save();
          message.channel.send('The counter is applied into ' + channel.toString());
        })
      }
  }
