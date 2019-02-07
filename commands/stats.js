const Discord = require("discord.js")
const moment = require("moment");
const m = require("moment-duration-format");
let os = require('os');
let cpuStat = require("cpu-stat");
const ms = require("ms");
var prettyMs = require('pretty-ms');
var oss = require('os-utils');

exports.run = (client, message, args) => { 

function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return {
        d: d
        , h: h
        , m: m
        , s: s
    };
};
  
 let u = convertMS(client.uptime);
 let uptime = u.d + " days : " + u.h + " hours : " + u.m + " minutes : " + u.s + " seconds";

  let bicon = client.user.displayAvatarURL;
  let cpuLol;
  cpuStat.usagePercent(function(err, percent, seconds) {
    if (err) {
      return console.log(err);
    }
  let owner =  client.users.get("525322591796199445").username;
  const embedStats = new Discord.RichEmbed()
    .setTitle("Bot Stats")
    .setColor("RANDOM")
    .setThumbnail(bicon)
    .addField("Created By",`${owner}`)
    .addField("👤 Users", `${client.users.size.toLocaleString()}`, true)
    .addField("📊 Servers", `${client.guilds.size}`, true)
    .addField("🔖 Channels ", `${client.channels.size.toLocaleString()}`, true)
    .addField("⏱ Bot Uptime", `${parseDur(client.uptime)}`, true)
    //.addField("⏱ Server Uptime", `${prettyMs(oss.sysUptime())} `, true)
    .addField("🔈 Playing Music In",`${client.voiceConnections.size} Server`)
    .addField("🎛 CPU Usage", `\`${percent.toFixed(2)}%\``);
  message.channel.send(embedStats);
  });
}
function parseDur(ms){
    let seconds = ms / 1000;
    let days = parseInt(seconds / 86400);
    seconds = seconds % 86400;
    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60);
    
    if (days) {
      return `**${days}** Days **${hours}** Hours **${minutes}** Minutes **${seconds}** Seconds`;
    }
    else if (hours) {
      return `**${hours}** Hours **${minutes}** Minutes **${seconds}** Seconds`;
    }
    else if (minutes) {
      return `**${minutes}** Minutes **${seconds}** Seconds`;
    }
    return `**${seconds}** Seconds`;
  }
 exports.conf = {
  aliases: [""]
 }
 module.exports.config = {
    name: "stats",
    description: "sends your pfp!",
    usage: "",
    accessableby: "Members",
    aliases: ["stat","botinfo"]
 }