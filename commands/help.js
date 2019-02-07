const Discord = require('discord.js')

exports.run = async(client, message, args) => {

  let prefix = client.prefix;
  
  
  if(`${args[0]}` == "1") {
  let support = new Discord.RichEmbed()
.setColor("RANDOM")
.setDescription("All *Music** commands listed below")
.addField(`${prefix}play`,"To play song")
.addField(`${prefix}skip`,"To skip the song")
.addField(`${prefix}np`,"Shows the current playing song")
.addField(`${prefix}pause`,"Pause the current playing song")
.addField(`${prefix}resume`,"Resume the current playing song")
.addField(`${prefix}voulume`,"To increase or decrease the volume of song")
.addField(`${prefix}disconnect`,"To disconnect the bot from voice channel")
.setFooter(`Requested By ${message.author.tag}`)
.setTimestamp();
return message.channel.send(support);
 }
 else if(`${args[0]}` === '2') {
  let support = new Discord.RichEmbed()
.setColor("RANDOM")
.setDescription("Some **General** commands listed below")
.addField(`${prefix}avatar`,"Shows your avatar and gives link of your avatar")
.addField(`${prefix}serverinfo`,"A command which gives some information about server")
.addField(`${prefix}prefix`,"To change the prefix for bot command")
.setFooter(`Requested By ${message.author.tag}`)
.setTimestamp();
return message.channel.send(support);
  }
    let helpemb = new Discord.RichEmbed()
.setDescription(`Bot prefix is \`${prefix}\``)
.setColor(`RANDOM`)
.addField(`**__1.Music__**`,`**${prefix}help 1**`)
.addField(`**__2.General__**`,`**${prefix}help 2**`)
.addField('Want To Invite Me',`[Click Here To Invite Me](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958847)`)
 message.channel.send(helpemb);
}
module.exports.config = {
    name: "help",
    description: "Gives bot invite link",
    usage: "",
    accessableby: "Members",
    aliases: ["help",'h','halp','cmds']
}