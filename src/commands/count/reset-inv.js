const { Client, Message, MessageEmbed } = require('discord.js');
const users = require('../../schema/Users');
module.exports = {
    name: 'reset-inv',
    category: 'Configuration',
    description: 'Allows to restart the inventories of the members of the server',
    usage: '',
    permissions: 'ADMINISTRATOR',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
        users.find({ Guild: message.guild.id  }, async(err, data) => {
            if(!data) {
                return message.channel.send(`This server has no members with inventory! Use the \`${client.prefix}create-account\` command to create an account/inventory`)
            } else {

                await message.channel.send(`Are you sure you want to reset inventories?`).then(async function (m) {
                    await m.react('✅');
                    await m.react('❌');
     
                    let collector = m.createReactionCollector((reaction, user) => user.id == message.author.id, {
                        time: 10000
                    })
               

                collector.on('collect', async(reaction) => {
                    if(reaction.emoji.name == '✅') {
                        data.forEach(async(f) => {
                            f.Items = [];
                            f.save();
                        })
                        await m.edit(`Inventories have been successfully reset!`)
                        collector.stop()
                    } else 
                    if(reaction.emoji.name == '❌') {
                        await m.edit(`Inventories have not been reset!`)
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
