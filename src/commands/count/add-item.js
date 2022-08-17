const { Client, Message, MessageEmbed } = require('discord.js');
const user = require('../../schema/Users');
const shop = require('../../schema/Shop');
module.exports = {
    name: 'add-item',
    category: 'Configuration',
    description: 'Allows to add a shop object to a member',
    usage: '<membre> <item> <quantity>',
    permissions: 'MANAGE_MESSAGES',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You do not have permission to do this command!');
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.channel.send('Please mention a member!');


        const item = args[1];
        if(!item) return message.channel.send('Please put an item!');
        const quantity = args[2];
        if(!quantity) return message.channel.send('Please put a quantity/ammount!');

        shop.findOne({ id: message.guild.id, name: item }, async(err, data) => {

            if(!data) {
                return message.channel.send('This item does not exist!')
            } else {
                user.findOne({ id: member.id, Guild: message.guild.id }, async(err, data2) => {

                    if(!data2) {
                        return message.channel.send(`This member does not have an account yet! Use the \`${client.prefix}create-account\` command to create an account!`)
                    } else {

                        if(data2.Items.find(it => it.name === item)) {
                            data2.Items.find(it => it.name === item).quantity = parseInt(data2.Items.find(it => it.name === item).quantity) + parseInt(quantity);
                        } else {
                            data2.Items.push({
                                name: item,
                                quantity: quantity
                            })
                        }

                        data2.save();
                    message.channel.send(`${member} received ${quantity} ${item}!`)
                    }
                })
            }
        })
    }
}
