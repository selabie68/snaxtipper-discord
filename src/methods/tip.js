const {tip} = require('../utils/snax')
const { TOKEN_CONTRACT, TOKEN_PRECISION, MINIMUM_TIP, MAXIMUM_TIP, BLOKS_URL, BOT_USERNAME, TOKEN_SYMBOL } = require('../constants')

async function handleTip(message) {
  const args = message.content.replace(/\s+/g,' ').trim().split(' ');

  if(args.length < 4) {
    message.reply("Invalid Command!")
    return false;
  }

  const symbol = args[3].toUpperCase();
  const amount = args[2];

  const to_username = message.mentions.users.first().username;
  const from_username = message.author.username;
  const tipper_id = message.author.id;
  const tipped_id = message.mentions.users.first().id;

  if (tipped_id === tipper_id) {
    message.reply('You cannot tip yourself.');
    return false;
  }

  if(message.mentions.users.first().bot) {
    message.reply('You cannot tip a bot.')
    return false;
  }

  if(message.mentions.everyone) {
    message.reply('Tipping everyone not yet supported.')
    return false;
  }

  if (symbol !== TOKEN_SYMBOL) {
    message.reply('Token not yet supported.');
    return false;
  }

  const quantity = Number(amount);

  if (!quantity || quantity < MINIMUM_TIP) {
    message.reply(`Must tip at least ${MINIMUM_TIP} ${symbol}!`)
    return false;
  }

  if (quantity > MAXIMUM_TIP) {
    message.reply(`The max tip is ${MAXIMUM_TIP.toFixed(TOKEN_PRECISION)} ${symbol}!`)
    return false;
  }

  const memo = args.length > 4 ? args.slice(4).join(' ') : '';

  const finalQuantity = `${quantity.toFixed(TOKEN_PRECISION)} ${symbol}`;

  (async () => {
    try {
      const result = await tip (TOKEN_CONTRACT, tipper_id, tipped_id, from_username, to_username, finalQuantity, memo)

      const bloksLink = `${BLOKS_URL}/transactions/${result.processed.block_num}/${result.transaction_id}`
      const replyMessage = `Successfully tipped @${to_username} ${finalQuantity}!\n${bloksLink}`

      message.reply(replyMessage)
    } catch (e) {
      console.log(e)
      message.reply('Could not tip due to ' + e)
    }
  })();
}

module.exports = {handleTip};