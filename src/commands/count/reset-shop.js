const { Client, Message, MessageEmbed } = require('discord.js');
const shop = require('../../schema/Shop');
module.exports = {
    name: 'reset-shop',
    category: 'Configuration',
    description: 'Allows you to reset shop items',
    usage: '',
    permissions: 'ADMINISTRATOR',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You do not have permission to use this command!');
        shop.find({ Guild: message.guild.id  }, async(err, data) => {
            if(!data) {
                return message.channel.send(`This server has no shop! Use the \`${client.prefix}set-item\` command to add items!`)
            } else {
                await message.channel.send(`Are you sure you want to reset the shop?`).then(async function (m) {
                    await m.react('✅');
                    await m.react('❌');
     
                    let collector = m.createReactionCollector((reaction, user) => user.id == message.author.id, {
                        time: 10000
                    })
               

                collector.on('collect', async(reaction) => {
                    if(reaction.emoji.name == '✅') {
                        // delete all items (documents) from the collection using guild id
                        await shop.deleteMany({ id: message.guild.id }, async(err, data) => {
                            if(err) {
                                console.log(err)
                            } else {
                                await m.edit(`Shop items have been successfully reset!`)
                                collector.stop()
                            }
                        })
                    } else 
                    if(reaction.emoji.name == '❌') {
                        await m.edit(`Shop items have not been reset!`)
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
