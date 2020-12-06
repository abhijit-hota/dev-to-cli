const { Command } = require('commander');
const postArticle = require('./postArticle');

const program = new Command();

console.log('Hi, welcome to Dev.to CLI');

const get = program.command('get');

get
  .command('followers', 'Get a list of your followers', {
    executableFile: 'getFollowers.js',
  })
  .option('-u --users', 'Fetch Users', true)
  .option('-o --orgs', 'Fetch Organisations', false);

const articles = program
  .command('articles')
  .description('Get articles or Post an article.');

articles
  .command('create')
  .description('Create a draft or publish an article from a markdown file')
  .option('-f, --input-file <file>', 'Post a Markdown file as an article')
  .action(function post() {
    postArticle(this.inputFile);
  });

program.parse(process.argv);
