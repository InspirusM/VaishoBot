exports.run = async client => {

  console.log(`${client.user.username} is online on ${client.guilds.size} servers!`);
  client.user.setActivity(`${client.prefix}help | Music`, {type: "LISTENING"});
  
}
