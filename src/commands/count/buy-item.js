const { Client, Message, MessageEmbed, User } = require('discord.js');
const shop = require('../../schema/Shop');
const user = require('../../schema/Users');
module.exports = {
    name: 'buy',
    category: 'Economy',
    description: 'Allows you to buy an item from the shop',
    usage: '<item> <quantity>',
    permissions: 'Aucune',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        shop.find({ id: message.guild.id }, async(err, data) => {
            if(err) throw err;

            if(!data) {
                return message.channel.send('No item is available in the shop!')
            } else {
            user.findOne({ id: message.author.id, Guild: message.guild.id }, async(err, data2) => {
                if(err) throw err;
                const item = args[0];
                const quantity = args[1];

                if(!item) return message.channel.send('Please mention an item!')
                if(!quantity) return message.channel.send('Please put a quantity!')

                const price = Math.round(data.find(x => x.name === item).price) * quantity;

                if(data.find(x => x.name === item)) {

                    if(data2.Points >= price) {
                        data2.Points -= price
                        if(data2.Items.find(x => x.name === item)) {
                            data2.Items.find(x => x.name === item).quantity = parseInt(data2.Items.find(x => x.name === item).quantity) + parseInt(quantity)
                        } else if(!data2.Items.find(x => x.name === item)) {
                        data2.Items.push(
                            {
                                name: item,
                                quantity: quantity
                            }
                        )
                        }
                        data2.save();
                        message.channel.send(`You purchased ${quantity} ${item} for ${price}`)
                    } else if(data2.Points < price) {
                        message.channel.send('You do not have enough money')
                    }
                } else if(!data.find(x => x.name === item)) {
                    message.channel.send('This item is not available in the shop')
                }
            })
        }
        })
    }
}
