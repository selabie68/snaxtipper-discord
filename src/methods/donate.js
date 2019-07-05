const {tip} = require('../utils/snax')
const { TOKEN_CONTRACT, TOKEN_PRECISION, MINIMUM_TIP, MAXIMUM_TIP, BLOKS_URL, BOT_USERNAME, TOKEN_SYMBOL } = require('../constants')

async function handleDonate(message) {
  const args = message.content.replace(/\s+/g,' ').trim().split(' ');

  if(args.length < 3) {
    message.reply("Invalid Command!")
    return false;
  }

  const symbol = args[2].toUpperCase();
  const amount = args[1];

  const to_username = 'anarcist';
  const from_username = message.author.username;
  const tipper_id = message.author.id;
  const tipped_id = 388636577317912578;

  if (tipped_id === tipper_id) {
    message.reply('You cannot tip yourself.');
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

module.exports = {handleDonate};