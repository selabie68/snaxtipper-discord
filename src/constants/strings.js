const HELP_TEXT = `
\`\`\`
{prefix}tip <tagged_user> <amount> SNAX <memo> - Tips the tagged user e.g. {prefix}tip @anarcist 100 SNAX
{prefix}deposit - Shows instructions for deposit including your unique id
{prefix}withdraw <snax_account> <amount> SNAX <memo> - Withdraw from the bots smart contract to your SNAX account
{prefix}balance - Displays your token balances
{prefix}help - Shows this help text
{prefix}donate <amount> SNAX <memo> - Donate to the awesome developer
\`\`\`
`

module.exports = {
  HELP_TEXT
}