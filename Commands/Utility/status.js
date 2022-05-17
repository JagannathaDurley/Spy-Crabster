const { MessageEmbed, CommandInteraction, Client, version, MessageActionRow, MessageButton } = require("discord.js");
const { connection } = require("mongoose");
const os = require("os");

module.exports = {
    name: "stats",
    description: "Displays the stats of the client and database.",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        await client.user.fetch();
        await client.application.fetch();

        const getChannelTypeSize = (type) => client.channels.cache.filter((channel) => type.includes(channel.type)).size;

        const status = [
            "Disconnected",
            "Connected",
            "Connecting",
            "Disconnecting"
        ];

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`${client.user.username} Stats`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setDescription(interaction.client.application?.description)
            .addFields(
                { name: "👩🏻‍🔧 Client", value: client.user.tag, inline: true },
                { name: "📆 Created", value: `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: "☑ Verified", value: client.user.flags.has("VERIFIED_BOT") ? "Yes" : "No", inline: true },
                { name: "👩🏻‍💻 Owner", value: `${interaction.client.application.owner.tag || "None"}`, inline: true },
                { name: "📚 Database", value: status[connection.readyState], inline: true },
                { name: "🖥 System", value: os.type().replace("Windows_NT", "Windows").replace("Darwin", "macOS"), inline: true },
                { name: "🧠 CPU Model", value: `${os.cpus()[0].model}`, inline: true },
                { name: "💾 CPU Usage", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}%`, inline: true },
                { name: "⏰ Up Since", value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`, inline: true },
                { name: "👩🏻‍🔧 Node.js", value: process.version, inline: true },
                { name: "🛠 Discord.js", value: version, inline: true },
                { name: "🏓 Ping", value: `${client.ws.ping}ms`, inline: true },
                { name: "🤹🏻‍♀️ Commands", value: `${client.commands.size}`, inline: true },
                { name: "🌍 Servers", value: `${client.guilds.cache.size}`, inline: true },
                { name: "👨‍👩‍👧‍👦 Users", value: `${client.users.cache.size}`, inline: true },
                { name: "💬 Text Channels", value: `${getChannelTypeSize(["GUILD_TEXT", "GUILD_NEWS"])}`, inline: true },
                { name: "🎤 Voice Channels", value: `${getChannelTypeSize(["GUILD_VOICE", "GUILD_STAGE_VOICE"])}`, inline: true },
                { name: "🧵 Threads", value: `${getChannelTypeSize(["GUILD_THREAD", "GUILD_NEWS_THREAD", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"])}`, inline: true }
            );

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('LINK')
                    .setLabel('Support Server')
                    .setURL('https://discord.gg/8mGA7KFyWg/'),
                new MessageButton()
                    .setStyle('LINK')
                    .setLabel('Website')
                    .setURL('https://spycrabster.tk/'),
                new MessageButton()
                    .setStyle('LINK')
                    .setLabel('Invite')
                    .setURL('https://discord.com/oauth2/authorize?client_id=972871021382238228&permissions=2201414992&scope=bot%20applications.commands')
            )
        interaction.reply({ embeds: [embed], components:[row] });
    }
}