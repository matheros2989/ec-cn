const { Client, Message, MessageEmbed } = require('discord.js');
const { ReactionPages } = require('reconlx')
const data = require('../../schema/Users');
module.exports = {
    name: 'leaderboard',
    category: 'Economy',
    description: 'Displays the leaderboard',
    usage: '',
    permissions: 'Aucune',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        data.find({ Guild: message.guild.id }, async(err, data) => {
            const sort = data.sort((a, b) => b.Counts - a.Counts);

            let i = 1;

            if(data.length > 10 ){
                const chunks = twochunk(sort, 10);
                const arry = [];

                for(const chunk of chunks) {
                    const chunking = chunk.map((v) => `\`#${i++}\` **<@${v.id}>** (${v.Counts} nombres)`).join('\n\n');
                    arry.push(
                        new MessageEmbed()
                        .setTitle('Leaderboard of ' + message.guild.name).setColor('RANDOM').setThumbnail(message.guild.iconURL({ dynamic: true }))
                        .setDescription(chunking)
                    )
                }
                ReactionPages(message, arry, true)
            } else if(data.length < 10 && data.length > 0){
                const mapping = sort.map((v) => `\`#${i++}\` **<@${v.id}>** (${v.Counts} nombres)`).join('\n\n')
                message.channel.send(
                    new MessageEmbed()
                        .setTitle('Leaderboard of ' + message.guild.name).setThumbnail(message.guild.iconURL({ dynamic: true })).setColor('RANDOM')
                        .setDescription(mapping)
                )
            } else if(data.length === 0) {
                message.channel.send('No one in the leaderboard!')
            }
        })
    }
}

function twochunk(arr, size) {
    var array = [];
    for(var i = 0; i < arr.length; i += size) {
        array.push(arr.slice(i, i+size));
    }
    return array;
}
