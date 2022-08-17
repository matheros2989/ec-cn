const { Client, Message, MessageEmbed } = require('discord.js');
const guild = require('../../schema/Guild');
module.exports = {
    name: 'reset-count',
    category: 'Configuration',
    description: 'Allows to restart the server counter',
    usage: '',
    permissions: 'ADMINISTRATOR',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
        guild.findOne({ id: message.guild.id }, async(err, data) => {
            if(!data) {
                return message.channel.send(`This server does not have a counter yet! Use the \`${client.prefix}set-channel\` command to create a counter!`)
            } else {

                await message.channel.send(`Are you sure you want to reset the counter?`).then(async function (m) {
                    await m.react('✅');
                    await m.react('❌');
     
                    let collector = m.createReactionCollector((reaction, user) => user.id == message.author.id, {
                        time: 10000
                    })
               

                collector.on('collect', async(reaction) => {
                    if(reaction.emoji.name == '✅') {
                        data.Current = 0;
                        data.User = "";
                        data.Channel = ""
                        data.save();
                        m.edit(`The counter has been successfully reset!`)
                        collector.stop()
                    } else 
                    if(reaction.emoji.name == '❌') {
                        await m.edit(`The counter has not been reset!`)
                        collector.stop()
                    }
                })
                collector.on('end', async() => {
                    await m.reactions.removeAll()
                })
            })
            }
        })
    }
}
