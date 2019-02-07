var Discord = require(`discord.js`)

module.exports.run = async (client, message, args) => {
  let invite = new Discord.RichEmbed()
  .setColor("#fffff")
  .setDescription(`**[Click here for invite link](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958847)**`)
return message.channel.send(invite);
}
module.exports.config = {
    name: "invite",
    description: "Gives bot invite link",
    usage: "",
    accessableby: "Members",
    aliases: ["invme"]
}