const {getBalance} = require('../utils/snax')

async function showBalance(message) {
  const { rows } = await getBalance(message.author.id);

  return message.reply(
    rows.map(row => `${row.contract}: **${row.balance}**`).join('<br/>') || 'User currently has no balance.'
  );
}

module.exports = {showBalance};

