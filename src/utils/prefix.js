const { Datastore } = require('nedb-async-await');
const db = Datastore({filename: 'snaxtipper_discord', autoload: true});

async function getPrefix(message) {
  let prefix = '!';

  let result = await db.findOne({type: 'guild_config', guild_id: message.guild.id})

  if (result) {
    prefix = result.data.prefix
  } else {
    prefix = '!';
  }

  return prefix;
}

function setPrefix(message) {
  const args = message.content.replace(/\s+/g,' ').trim().split(' ');
  if (args.length > 2) {
    message.reply('Too many arguments!');
    return false;
  }

  db.find({type: 'guild_config', guild_id: message.guild.id}).then((result) => {
    if (result.length > 0) {
      db.update({type: 'guild_config', guild_id: message.guild.id}, {$set: {'data.prefix': args[1]}}).then((result) => {
        message.reply('Prefix changed to \`' + args[1] + '\`')
      })
    } else {
      db.insert({type: 'guild_config', guild_id: message.guild.id, data: {prefix: args[1]}}).then((result) => {
        message.reply('Prefix changed to \`' + args[1] + '\`')
      })
    }
  })
}

module.exports = {getPrefix, setPrefix}