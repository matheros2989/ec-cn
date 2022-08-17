const { Client, Message, MessageEmbed } = require('discord.js');
const user = require('../../schema/Users');
module.exports = {
    name: 'add-money',
    category: 'Configuration',
    description: 'Allows to add money to a member',
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

        const money = args[1];
        if(!money) return message.channel.send('Please put a quantity!');

        user.findOne({ id: member.id, Guild: message.guild.id }, async(err, data) => {
            if(!data) {
                return message.channel.send(`This member does not have an account yet! Use the \`${client.prefix}create-account\` command to create an account!`)
            } else {
                data.Points = parseInt(data.Points) + parseInt(money);
            }
            data.save();
            message.channel.send(`${member} received ${money}`)
        })
    }
}
