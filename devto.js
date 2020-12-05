const { Command } = require('commander');

const program = new Command();

console.log('Hi, welcome to Dev.to CLI');

const get = program.command('get');

get
  .command('followers', 'Get a list of your followers', {
    executableFile: 'getFollowers.js',
  })
  .option('-u --users', 'Fetch Users', true)
  .option('-o --orgs', 'Fetch Organisations', false);

program.parse(process.argv);
