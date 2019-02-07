const Discord = require('discord.js');

module.exports.run = (client, message, args) => {

        let user = message.mentions.users.first() || message.author; // Mentioned user
        let image = user.displayAvatarURL; // Get image URL
        let embed = new Discord.RichEmbed()
            .setDescription(`[Click here for your avatar link](${image})`)
            .setColor("RANDOM") // Set color (If you don't have ideas or preference, use RANDOM for random colors)
            .setImage(image) // Set image in embed
        message.channel.send(embed); // Send embed
    }
module.exports.config = {
    name: "avatar",
    description: "sends your pfp!",
    usage: "",
    accessableby: "Members",
    aliases: ["pfp"]
}