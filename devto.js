const { Command } = require('commander');
const getFollowers = require('./features/getFollowers');
const getReadingList = require('./features/getReadingList');
const postArticle = require('./features/postArticle');

const program = new Command();

// Get followers feature
const followers = program.command('followers');
followers
  .description('Get a list of your followers')
  .option('-n, --num-users <num>', 'Number of users to display', 20)
  .action(getFollowers);

// Articles features
const articles = program
  .command('articles')
  .description('Get articles or Post an article.');

// Articles: create
articles
  .command('create')
  .description('Create a draft or publish an article from a markdown file')
  .option('-f, --input-file <file>', 'Post a Markdown file as an article')
  .action(function post() {
    postArticle(this.inputFile);
  });
// TODO Articles: get user articles
// TODO Articles: get homepage articles
// TODO Articles: update user article?

// Reading List command
program
  .command('rlist')
  .description('Get your Reading List')
  .option('-n --num-items <num>', 'How many to fetch at once', 30)
  .action(function getList() {
    getReadingList(1, this.numItems);
  });

program.parse(process.argv);
