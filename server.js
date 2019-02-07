const Discord = require('discord.js')
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY);
const client = new Discord.Client();
const fs = require("fs")
var db = require('quick.db');

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const queue = new Discord.Collection();
client.queue = queue;
client.prefix = '%';
client.fetch = require('node-superfetch');


//event handler
fs.readdir("./events/", (err, files) => {
if (err) console.log(err);
files.forEach(file => {
let eventFunc = require(`./events/${file}`);
let eventName = file.split(".")[0];
client.on(eventName, (...args) => eventFunc.run(client, ...args));
	});
});

//command handler
fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js") 
    if(jsfile.length <= 0) {
         return console.log("[LOGS] Couldn't Find Commands!");
    }
    console.log(`[Commands]\tLoaded a total amount ${files.length} Commands`);
    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        console.log(`${f} Is Loaded!`)
        client.commands.set(pull.config.name, pull);  
        pull.config.aliases.forEach(alias => {
            client.aliases.set(alias, pull.config.name)
        });
    });
});


client.on('error', console.error);

client.on("message", async message => {
  
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  const prefix = client.prefix;
  if (!message.content.startsWith(prefix)) return;
  
  var args2 = message.content.substring(prefix.length).split(" ");
  var searchString = args2.slice(1).join(' ');
  var url = args2[1] ? args2[1].replace(/<(.+)>/g, '$1') : '';
	var serverQueue = queue.get(message.guild.id);
  var voiceChannel = message.member.voiceChannel;
	var permissions = voiceChannel.permissionsFor(message.client.user);
  var crossEmoji = `<:CrossMark:536404309991096341>`;
  var checkEmoji = `<:CheckMark:536391199616008212>`;
  
  switch (args2[0].toLowerCase()) {
         case "play":
         case "p":
    
      
		if (!voiceChannel) return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | You need to be in voice channel first!`}});
		if (!permissions.has('CONNECT')) { 
      
      return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | I don't have permission to connect in ${voiceChannel.name}`}}).then(m => {
        
      m.delete(10000);
        
     });                                
      }
    
	
		if (!permissions.has('SPEAK')) {
     return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | I don't have permission to speak in ${voiceChannel.name}`}}).then(m => {
       
     m.delete(10000);
       
     }); 
      
		}
      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			var playlist = await youtube.getPlaylist(url);
			var videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				var video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, message, voiceChannel, true);
			}
        const playlistembed = new Discord.RichEmbed()
        .setColor(`#FFC500`)
        .setDescription(`{checkEmoji} | Added ${playlist.title} has been added to the queue`);
			return message.channel.send(playlistembed);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 5);
					var index = 0;
          let selectionemb = new Discord.RichEmbed()
          .setTitle(`🎶 Song selection`)
          .setDescription(`${videos.map(video2 => `**${++index} -** [${video2.title}](${video2.url})`).join('\n')}`)
          .setFooter('🔎 Please provide a number to select one of the search results ranging from 1-5.')
          .setColor('#FFC500')
					message.channel.send(selectionemb).then(message => {
            message.delete(11000)
          })
					// eslint-disable-next-line max-depth
					try {
						var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 6, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
            let noinvemb = new Discord.RichEmbed()
            .setDescription('No or invalid value entered, cancelling video selection.')
            .setColor('#FF0000')
						return message.channel.send(noinvemb).then(message => {
              message.delete(5000)
            })
					}
					var videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return message.channel.send('No searched results found!');
				}
			}
			return handleVideo(video, message, voiceChannel);
		}
        break;
      case "skip":
      case "s":
		if (!message.member.voiceChannel) return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | You need to be in voice channel first!`}});
		if (!serverQueue) return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | There is nothing Playing`}});
    if(message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | You are not in the same voice Channel`}});
		    serverQueue.connection.dispatcher.end();
        message.channel.send({embed: {color: 0xFFC500, description: `⏹ | Skipped the song!`}})
		return undefined;
        break;
      case "d":
      case "disconnect":
		if (!message.member.voiceChannel) return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | You need to be in voice channel first!`}});
		if (!serverQueue) return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | There is nothing Playing`}});
    if(message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | You are not in the same voice Channel`}});
		    serverQueue.connection.dispatcher.end();
        message.channel.send({embed: {color: 0xFFC500, description: `⏹ | Stopped the song!`}})
		return undefined;
break;
      case "volume":
      case "v":

		if (!message.member.voiceChannel) return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | You need to be in voice channel first!`}});
		if (!serverQueue) return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | There is nothing Playing`}});
    if(message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | You are not in the same voice Channel`}});
       
      let currentvolumeemb = new Discord.RichEmbed()
        .setDescription(`The current volume is: **${serverQueue.volume}%**`)
        .setColor('#FFC500')
		if (!args2[1]) return message.channel.send(currentvolumeemb);
    if (args2[1] > 100) return message.channel.send({embed: {color: 0xFF0000, description:`Volume limit is: 100%`}});
		serverQueue.volume = args2[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args2[1] / 5);
        let setvolumeemb = new Discord.RichEmbed()
        .setDescription(`I set the volume to: **${args2[1]}%**`)
        .setColor('#FFC500')
		return message.channel.send(setvolumeemb);
break;
      case "np":
		if (!serverQueue) return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | There is nothing Playing`}});
        let nowplayingemb = new Discord.RichEmbed()
        .setDescription(`🎶 Now playing\n**${serverQueue.songs[0].title}**`)
        .setColor(`#FFCC500`)
		return message.channel.send(nowplayingemb);
break;
      case "queue":
      case "q":
        if (!serverQueue) return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | There is nothing Playing`}});
        let queueemb = new Discord.RichEmbed()
        .setAuthor(`${message.guild.name} Queue list `)
        .setDescription(`${serverQueue.songs.map(song => `**•** [${song.title}](https://www.youtube.com/watch?v=${song.id}})`).join('\n')}`)
        .setColor(`#FFCC500`)
		return message.channel.send(`🎶 **Now playing:** ${serverQueue.songs[0].title}`,queueemb)
break;
      case "pause":
      
    if(message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | You are not in the same voice Channel`}});
      
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send({embed: {color: 0xFFCC500, description:`⏸ | Paused`}});
		}
		return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | There is nothing Playing`}});
break;
      case "resume":
      case "r":
      
    if(message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | You are not in the same voice Channel`}});  
      
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send({embed: {color: 0xFFCC500, description:`⏯ | Resumed`}});
		}
		return message.channel.send({embed: {color: 0xFF0000, description:`${crossEmoji} | There is nothing Playing`}});
	
	return undefined;
break;
}
async function handleVideo(video, message, voiceChannel, playlist = false) {
	var serverQueue = queue.get(message.guild.id);
	console.log(video);
	var song = {
    id: video.id,
    title: Discord.Util.escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`, 
    durationmm: video.durationSeconds ? video.durationSeconds : video.duration / 1000,
    channel: message.member.voiceChannel.name,
    uploadedby: video.channel.title, 
    channelurl: `https://www.youtube.com/channel/${video.channel.id}`,
    author: message.author,
    durationh: video.duration.hours,
    durationm: video.duration.minutes,
    durations: video.duration.seconds, 
    duration: video.duration,
    requestor: message.author,
	};
	if (!serverQueue) {
		var queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(message.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
			queue.delete(message.guild.id);
			return message.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
    //let queuelog = client.channels.get('502121071789604865')
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
    
		if (playlist) return undefined;
    
var adedembed = new Discord.RichEmbed()

  .setColor(`#FFCC500`)
  .setAuthor(`Added to Queue`, `https://images-ext-1.discordapp.net/external/YwuJ9J-4k1AUUv7bj8OMqVQNz1XrJncu4j8q-o7Cw5M/http/icons.iconarchive.com/icons/dakirby309/simply-styled/256/YouTube-icon.png`)
  .setTitle(`${song.title}`, song.url)
  .addField("Duration:", `${require('./util.js').timeString(song.durationmm)}`, true)
  .addField('Publisher', `[${song.uploadedby}](${song.channelurl})`, true)
  .setFooter(`Requested By: ${song.author.tag}`)
  .setTimestamp();
 return message.channel.send(adedembed);
	}
	return undefined;
}
  function play(guild, song) {
	var serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
   
    
    
var pleyembed = new Discord.RichEmbed()

  .setColor(`#FFCC500`)
  .setAuthor(`Start Playing`, `https://images-ext-1.discordapp.net/external/YwuJ9J-4k1AUUv7bj8OMqVQNz1XrJncu4j8q-o7Cw5M/http/icons.iconarchive.com/icons/dakirby309/simply-styled/256/YouTube-icon.png`)
  .addField('Title', `**[${song.title}](${song.url})**`, false)
  .addField("Video Publisher", `[${song.uploadedby}](${song.channelurl})`, true)
  .addField('Requested by', `<@${song.requestor.id}>`, true)
  .addField("Volume", `${serverQueue.volume}%`, true)
  .addField("Duration", `${require('./util.js').timeString(song.durationmm)}`, true)
  .setTimestamp();

	serverQueue.textChannel.send(pleyembed);
}

    

 let fetchedPrefix = await db.fetch(`serverPrefix_${message.guild.id}`);
if (fetchedPrefix === null) fetchedPrefix = prefix;
  else prefix = fetchedPrefix;
  if(message.content === prefix) return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let msg = message;
  
      if(!message.content.startsWith(prefix)) return;
    let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)))
    if(commandfile) commandfile.run(client,message,args,prefix)
   
});
client.login(process.env.BOT_TOKEN);

