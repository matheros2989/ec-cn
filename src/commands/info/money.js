const { Client, Message, MessageEmbed } = require('discord.js');
const user = require('../../schema/Users');
const { emoji } = require('../../config.json');

module.exports = {
    name: 'money',
    category: 'Economy',
    description: 'Displays all of your inventory information.',
    usage: '',
    permissions: 'None',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        const member = message.mentions.users.first() || message.author;
        await user.findOne({ id: member.id, Guild: message.guild.id }, async(err, data) => {
            if(err) throw err;
            if(!data) {
                return message.channel.send(`This member does not have an account yet! Use the \`${client.prefix}create-account\` command to create an account!`)
            } else {
                const embed = new MessageEmbed()
                .setTitle(`Bank of: **${member.username}**`)
                .setDescription(`**${data.Points}** ${emoji}\n\n`)
                .setFooter(message.author.username, message.author.avatarURL())
                .setColor(message.member.displayHexColor)
                .setTimestamp()
                message.channel.send(embed)
            }
        })
    }
}
