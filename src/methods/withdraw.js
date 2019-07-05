const {withdraw} = require('../utils/snax')
const {TOKEN_CONTRACT, TOKEN_SYMBOL, TOKEN_PRECISION, MINIMUM_TIP, BLOKS_URL} = require('../constants')

/**
 * Withdrawal
 */
async function handleWithdraw(message) {
  let args = message.content.replace(/\s+/g,' ').trim().split(' ')
  if (args.length < 4) {
    message.reply('Invalid command format.');
    return false;
  }
  let [, account, amount, symbol] = args

  // Validation
  const validName = account && /(^[a-zA-Z12345.]+$)/.test(account)

  if (!validName) {
    message.reply('Invalid name, make sure it is a valid SNAX account.')
    return false;
  }

  symbol = symbol.toUpperCase()

  if (!symbol || typeof symbol !== 'string' || symbol !== TOKEN_SYMBOL) {
    message.reply('Invalid symbol')
    return false;
  }

  if (!amount || amount < MINIMUM_TIP) {
    message.reply(`Must withdraw at least ${MINIMUM_TIP} ${symbol}!`)
    return false;
  }

  const from_id = message.author.id;
  const from_username = message.author.username;

  amount = Number(amount)

  const memo = args.length > 4 ? args.slice(4).join(' ') : '';

  const quantity = `${amount.toFixed(TOKEN_PRECISION)} ${symbol}`;

  message.reply(`Withdrawing ${quantity}...`).then(async (msg) => {
    try {
      const result = await withdraw(TOKEN_CONTRACT, from_id, from_username, account, quantity, memo);
      const bloksLink = `${BLOKS_URL}/transactions/${result.processed.block_num}/${result.transaction_id}`;
      const replyMessage = `Successfully withdrew **${quantity}** from **${from_username}** to SNAX account **${account}**\n${bloksLink}`;

      await msg.edit(replyMessage)
    } catch (e) {
      await msg.edit('Could not withdraw due to ' + e)
    }

  })
}

module.exports = {handleWithdraw}
