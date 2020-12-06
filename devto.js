const { Command } = require('commander');
const getFollowers = require('./features/getFollowers');
const postArticle = require('./features/postArticle');

const program = new Command();

console.log('Hi, welcome to Dev.to CLI');

const followers = program.command('followers');
followers
  .description('Get a list of your followers')
  .option('-n, --num-users <num>', 'Number of users to display', 20)
  .action(getFollowers);

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
