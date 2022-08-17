const { MessageEmbed } = require('discord.js');
const client = require('../index');
const db = require('../schema/Guild');
const user = require("../schema/Users");
client.on('message', async (message) => {
    const parsed = parseInt(message.content)
    const data = await db.findOne({
        id: message.guild.id
    });

    if (!data) return;

    if (message.channel.id !== data.Channel) return;
    if (message.author.bot) return;

    if (parsed === data.Current + 1) {

        if(data.User === message.author.id) {
            return message.delete({ reason: 'The user has already counted!' })
        } else {

        user.findOne({
            id: message.author.id,
            Guild: message.guild.id
        }, async (err, data) => {
            if (err) throw err;
            if (data) {
                const embed = new MessageEmbed()
                .setDescription(`\`${parsed}\` ${message.content.replace(parsed, '')}`)
                .setFooter(message.author.username, message.author.avatarURL())
                .setColor(message.member.displayHexColor)

                message.delete();

                message.channel.send(embed).then(msg => {
                    if (parsed % 100) {
                        
                    } else {
                        msg.pin({ reason: 'Comptage' }) 
                    }
                })
                data.Counts++;
                data.Points++;
            } else {
                if(message.content == '1') {
                    message.delete()
                    const embed = new MessageEmbed()
                    .setDescription(`\`${parsed}\` ${message.content.replace(parsed, '')}`)
                    .setFooter(message.author.username, message.author.avatarURL())
                    .setColor(message.member.displayHexColor)

                    message.channel.send(embed)
                }
                data = new user({
                    id: message.author.id,
                    Guild: message.guild.id,
                    Counts: 1,
                    Points: 0
                })
            }
            data.save();
        })
        data.Current = parseInt(message.content);
        data.User = message.author.id;
        data.save();
    }
    } else message.delete();
})
