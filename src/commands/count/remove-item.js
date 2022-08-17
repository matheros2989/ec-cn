const { Client, Message, MessageEmbed } = require('discord.js');
const user = require('../../schema/Users');
module.exports = {
    name: 'remove-item',
    category: 'Configuration',
    description: 'Allows you to withdraw money from a member',
    usage: '<membre> <quantity>',
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
        if(!quantity) return message.channel.send('Please put a quantity!');

        user.findOne({ id: member.id, Guild: message.guild.id, }, async(err, data) => {
            if(!data) {
                return message.channel.send(`This member does not have an account yet! Use the \`${client.prefix}create-account\` command to create an account!`)
            } else {
                data.Items.find(it => it.name === item).quantity = parseInt(data.Items.find(it => it.name === item).quantity) - parseInt(quantity);
                if(data.Items.find(it => it.name === item).quantity <= 0) {
                    data.Items.splice(data.Items.findIndex(it => it.name === item), 1);
                }
            }
            data.save();
            message.channel.send(`${member} has lost ${quantity} ${item}!`)
        })
    }
}
