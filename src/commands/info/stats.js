const { Client, Message, MessageEmbed, version } = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name : 'stats',
    category : 'Utility',
    description : 'Returns bot information',
    usage : '',
    permissions: 'Aucune',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {
        const msg = await message.channel.send(new MessageEmbed()
        .setDescription('Wait a moment...')
        .setColor('#0099ff'))

        const embed = new MessageEmbed()
            .setTitle('Information of bot')
            .addFields(
                { name: 'Bot latency:', value: `${msg.createdTimestamp - message.createdTimestamp}ms\n`},
                { name: 'API latency:', value: `${Math.round(client.ws.ping)}ms`},
                { name: 'Number of servers', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'Version of the bot:', value: `${version}`, inline: true },
                { name: 'Invite the bot:', value: `[Click herei](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8)`, inline: true },
                { name: 'Creator:', value: `<@!${config.id}>`, inline: true }
                )
            setTimeout(() => {
            msg.edit("", { embed: embed })
            }, 1500)
    }
}
