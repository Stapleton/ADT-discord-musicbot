require('dotenv').config({ path: './private.env' });
const FS = require('fs');
const PathModule = require('path');
const FlatFile = require('flat-file-db');
const DiscordJS = require('discord.js');
const DiscordBot = new DiscordJS.Client();
const Cassette = require('cassette');
const YouTubeAPI = require('googleapis');
const Tracer = require('tracer');
const Chalk = require('chalk');
const YTService = new Cassette.YouTubeService(process.env.YOUTUBE_API_KEY);
let Modules = { Commands: {}, Libs: {} }, DB = FlatFile.sync('./data.db'), Globals = {};
DB.clear();

function LoadModules(path) {
  FS.lstat(path, function(err, stat) {
    if (stat.isDirectory()) {
      let files = FS.readdirSync(path);
      let f, l = files.length;
      for (let i = 0; i < l; i++) {
        f = PathModule.join(path, files[i]);
        LoadModules(f);
      }
    } else {
      if (PathModule.basename(path, '.js') !== 'CMDs' || 'Utils') { require(path)(Modules) }
      else { console.log() }
    }
  });
}

let COMDIR = PathModule.join(__dirname, 'commands');
let LIBDIR = PathModule.join(__dirname, 'lib');
LoadModules(COMDIR);
LoadModules(LIBDIR);

DiscordBot.login(process.env.DISCORD_TOKEN);
DiscordBot.on('ready', function() {
  console.log(`Connected to ${DiscordBot.guilds.size} servers.`);
  let RichEmbedTemplate = new DiscordJS.RichEmbed();
  RichEmbedTemplate.setColor('RED');
  RichEmbedTemplate.setFooter('Alloybot - Music', DiscordBot.user.avatarURL);
  DB.put('RichEmbedTemplate', RichEmbedTemplate);
});

DiscordBot.on('message', function(Message) {
  let CurrentDJs, NoPerms;
  if (DB.has('CurrentDJs')) { CurrentDJs = DB.get('CurrentDJs') }
  else { CurrentDJs = {}; DB.put('CurrentDJs', CurrentDJs) }

  function DJ() {
    if (CurrentDJs[Message.guild.id] === Message.author.id || process.env.CREATOR_ID) { return true }
    else { return false };
  }

  if (!Message.guild) { return }
  else { NoPerms = `You do not have perms to do that. Only <@${CurrentDJs[Message.guild.id]}> can control me currently.` };

  if (Message.author.id === DiscordBot.user.id) return;

  if (!Globals[Message.guild.id]) Globals[Message.guild.id] = {};

  switch (Message.content.split(' ').shift().replace('>', '').toLowerCase()) {
    case 'add':
      if (DJ()) { Modules['Commands']['add'](Message) }
      else { Message.channel.send(NoPerms) };
      break;

    case 'clear':
      if (DJ()) { Modules['Commands']['clear'](Message) }
      else { Message.channel.send(NoPerms) };
      break;

    case 'getdj':
      Modules['Commands']['getdj'](Message);
      break;

    case 'help':
      Modules['Commands']['help'](Message);
      break;

    case 'join':
      if (DJ()) { Modules['Commands']['join'](Message) }
      else { Message.channel.send(NoPerms) };
      break;

    case 'leave':
      if (DJ()) { Modules['Commands']['leave'](Message) }
      else { Message.channel.send(NoPerms) };
      break;

    case 'list':
      if (DJ()) { Modules['Commands']['list'](Message) }
      else { Message.channel.send(NoPerms) };
      break;

    case 'pause':
      if (DJ()) { Modules['Commands']['pause'](Message) }
      else { Message.channel.send(NoPerms) };
      break;

    case 'play':
      if (DJ()) { Modules['Commands']['play'](Message) }
      else { Message.channel.send(NoPerms) };
      break;

    case 'resume':
      if (DJ()) { Modules['Commands']['resume'](Message) }
      else { Message.channel.send(NoPerms) };
      break;

    case 'setdj':
      if (DJ() || CurrentDJs[Message.guild.id] === undefined) { Modules['Commands']['setdj'](Message) }
      else { Message.channel.send(NoPerms) };
      break;

    case 'skip':
      if (DJ()) { Modules['Commands']['skip'](Message) }
      else { Message.channel.send(NoPerms) };
      break;

    case 'stop':
      if (DJ()) { Modules['Commands']['stop'](Message) }
      else { Message.channel.send(NoPerms) };
      break;

    case 'volume':
      if (DJ()) { Modules['Commands']['volume'](Message) }
      else { Message.channel.send(NoPerms) };
      break;
  }
});

module.exports = {
  DiscordBot: DiscordBot,
  DiscordJS: DiscordJS,
  Cassette: Cassette,
  DB: DB,
  Creator: process.env.DISCORD_USER_ID,
  Modules: Modules,
  YTService: YTService,
  Globals: Globals
}
