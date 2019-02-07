exports.run = async client => {

  client.user.setPresence({
        game: {
            name: `%help | v2 Released`,
            type: "STREAMING",
            url: "https://www.twitch.tv/monstercat"
        }
    });
  console.log(`${client.user.username} Is Ready To Serve ${client.guilds.size} Server And ${client.users.size} Users`);

  
}