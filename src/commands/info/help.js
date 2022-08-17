const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const client = require('../..');
const prefix = client.prefix

module.exports = {
    name: 'help',
    category: 'Utility',
    description: 'Displays the list of commands',
    usage: '<command>',
    permissions: 'None',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {

        const e = []; // Utilitaire
        const o = []; // Configuration
        const r = []; // Économie


        if (client.commands.map(x => x.category == 'Utility')) {
            e.push(client.commands.filter(c => c.category == 'Utility'));
        }
        if (client.commands.map(x => x.category == 'Configuration')) {
            o.push(client.commands.filter(c => c.category == 'Configuration'));
        }
        if (client.commands.map(x => x.category == 'Economy')) {
            r.push(client.commands.filter(c => c.category == 'Economy'));
        }

        const help = args[0];
        if (!help) {
            message.channel.send(new MessageEmbed()
                .setTitle('List of all commands')
                .addField("Utilities:", `${e[0].map(x => `\`${x.name}\``).join(', ')}`, true)
                .addField("Configuration:", `${o[0].map(x => `\`${x.name}\``).join(', ')}`, true)
                .addField("Economies:", `${r[0].map(x => `\`${x.name}\``).join(', ')}`, true)
                .setFooter(`Do ${prefix}help <command> for more information about a command!`)
                .setColor('#0099ff'))
        } else {

            const command = client.commands.map(c => c.name).find(c => c === help);
            if (!command) return message.channel.send('This command does not exist!');

            message.channel.send(new MessageEmbed()
                .setTitle(`Help for the \`${command}\` command`)
                .addField("Description:", `**${client.commands.get(command).description}**`, true)
                .addField("Category:", `**${client.commands.get(command).category}**`, true) 
                .addField("Usage:", `**${prefix}${client.commands.get(command).name} ${client.commands.get(command).usage}**`, true)
                .addField("Permissions:", `**${client.commands.get(command).permissions}**`, true)
                .setColor('#0099ff'))
        }
    }
}
