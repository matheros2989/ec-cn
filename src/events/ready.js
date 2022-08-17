const client = require('../index');

client.on('ready', () => {
    console.log(`${client.user.tag} is now online!`);
    client.user.setActivity('Matheros', {
        type: 'STREAMING',
        url: 'https://twitch.tv/saboyana'
    })
})
