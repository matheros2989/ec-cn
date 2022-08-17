const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const user = require('../../schema/Users');
const shop = require('../../schema/Shop');

module.exports = {
    name: 'inv',
    category: 'Economy',
    description: 'Displays all of your inventory information.',
    usage: '',
    permissions: 'None',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        const member = message.mentions.users.first() || message.author;

        user.find({
            id: member.id,
            Guild: message.guild.id
        }, async (err, data) => {
            if (err) throw err;

            shop.find({
                id: message.guild.id
            }, async (err, data2) => {

                if (err) throw err;
                const sort = data.map(x => x.Items).flat();

                let i = 1;

                if (data.length > 10) {
                    const items = twochunk(sort, 10);
                    const arry = [];

                    for (const item of items) {
                        const chunking = item.map((v) => `${i++} - **${v.name}** (${v.quantity})`).join('\n');
                        arry.push(
                            new MessageEmbed()
                            .setTitle('Inventory of' + member.username).setThumbnail(member.displayAvatarURL({
                                format: 'png'
                            })).setColor('RANDOM')
                            .setDescription(chunking)
                        )
                    }
                    ReactionPages(message, arry, true)
                } else if (data.length < 10 && data.length > 0) {
                    const mapping = sort.map((v) => `${i++} - **${v.name}** (${v.quantity})`).join('\n')
                    message.channel.send(
                        new MessageEmbed()
                        .setTitle('Inventory of' + member.username).setThumbnail(member.displayAvatarURL({
                            format: 'png'
                        })).setColor('RANDOM')
                        .setDescription(mapping)
                    )
                } else if (data.length === 0) {
                    return message.channel.send(`This member does not have an account yet! Use the \`${client.prefix}create-account\` command to create an account!`)
                }
            })
        })
    }
}


function twochunk(arr, size) {
    var array = [];
    for (var i = 0; i < arr.length; i += size) {
        array.push(arr.slice(i, i + size));
    }
    return array;
}
