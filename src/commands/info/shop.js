const { Client, Message, MessageEmbed } = require('discord.js');
const { ReactionPages } = require('reconlx')
const { emoji } = require('../../config.json');
const db = require('../../schema/Shop');

  module.exports = {
      name: 'shop',
      category: 'Economy',
      description: 'Display the shop',
      usage: '',
      permissions: 'None',
      /** 
       * @param {Client} client 
       * @param {Message} message 
       * @param {String[]} args 
       */
      run: async(client, message, args) => {
        db.find({ id: message.guild.id }, async(err, data) => {

            const sort = data.sort((a, b) => b.Counts - a.Counts);
            let i = 1;
            if(data.length > 10) {
                const items = twochunk(sort, 10);
                const arry = [];

                for(const item of items) {
                    const chunking = item.map((v) => `${emoji} ${v.price} - **${v.name}**\n${data.find(x => x.name === v.name).description}`).join('\n\n');
                    arry.push(
                        new MessageEmbed()
                        .setTitle('Shop of: ' + message.guild.name).setColor('RANDOM').setThumbnail(message.guild.iconURL({ dynamic: true }))
                        .setDescription(chunking)
                    )
                }
                ReactionPages(message, arry, true)
            } else if(data.length < 10 && data.length > 0) {
                const mapping = sort.map((v) => `${emoji} ${v.price} - **${v.name}**\n${data.find(x => x.name === v.name).description}`).join('\n\n')
                message.channel.send(
                    new MessageEmbed()
                        .setTitle('Shop of: ' + message.guild.name).setThumbnail(message.guild.iconURL({ dynamic: true })).setColor('RANDOM')
                        .setDescription(mapping)
                )
            } else if(data.length === 0) {
                message.channel.send('No items in the shop!')
            }
        })
      }
    }

    function twochunk(arr, size) {
        var array = [];
        for(var i = 0; i < arr.length; i += size) {
            array.push(arr.slice(i, i+size));
        }
        return array;
    }
