const Discord = require('discord.js');
const {handleDonate} = require("./methods/donate");
const {handleWithdraw} = require("./methods/withdraw");
const {getPrefix, setPrefix} = require('./utils/prefix');
const {handleTip} = require('./methods/tip');
const {showBalance} = require('./methods/balance');

const {HELP_TEXT} = require('./constants/strings');

// Create an instance of a Discord client
const client = new Discord.Client();

const {
  BOT_TOKEN,
  TIP_CONTRACT
} = require('./constants');

let prefix = '!';

client.on('ready', () => {
  console.log('SNAXTipBot is ready!');
});

client.on('message', async message => {
  if (!message.guild) return;

  if (message.author.bot) return;

  // Check the prefix for this guild
  prefix = await getPrefix(message);

  //console.dir(message.guild);

  if (message.content.startsWith(`${prefix}prefix`)) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
      setPrefix(message);
    }
    return;
  }

  if (message.content.startsWith(`${prefix}tip`)) {
    handleTip(message);
    return;
  }

  if (message.content.startsWith(`${prefix}donate`)) {
    handleDonate(message);
    return;
  }

  if (message.content.startsWith(`${prefix}deposit`)) {
    await message.reply(`Send SNAX to \`${TIP_CONTRACT}\` with your unique ID \`${message.author.id}\` as the memo to deposit!`);
    return;
  }

  if (message.content.startsWith(`${prefix}withdraw`)) {
    handleWithdraw(message);
    return;
  }

  if (message.content.startsWith(`${prefix}balance`)) {
    showBalance(message);
    return;
  }

  if (message.content.startsWith(`${prefix}help`)) {
    message.reply(HELP_TEXT.replace(/{prefix}/g, prefix));
    return;
  }

  if (message.content.startsWith(`${prefix}`)) {
    message.reply(`Invalid Command. Use \`${prefix}help\` for a list of commands.`);
  }
});

client.login(BOT_TOKEN);