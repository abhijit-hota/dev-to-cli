const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const open = require('open');

async function showReadingList(readingList, numItems) {
  const { articleURL } = await inquirer.prompt({
    type: 'list',
    name: 'articleURL',
    message: chalk.cyan('Your Reading List:').toString(),
    choices: [
      ...readingList.map((item) => ({
        name: item.article.title,
        value: item.article.url,
      })),
      {
        name: chalk.dim('Load more').toString(),
        value: 'loadmore',
      },
    ],
    pageSize: numItems + 1,
    loop: false,
    prefix: '🧾',
  });
  return articleURL;
}

async function getReadingList(page, perPage) {
  // eslint-disable-next-line global-require
  const { axios } = await require('../utils/axios');
  const spinner = ora(
    chalk.cyan('Fetching your Reading List').toString()
  ).start();
  try {
    const res = await axios.get(`readinglist?per_page=${perPage}&page=${page}`);
    const readingList = res.data;
    spinner.stop();

    const articleURL = await showReadingList(readingList, perPage);
    if (articleURL !== 'loadmore') await open(articleURL, { wait: true });
    else await getReadingList(page + 1, perPage);
  } catch (error) {
    spinner.stop();
    console.log(error.response && error.response);
    console.log(error.message && error.message);
    console.log(error.stack && error.stack);
  }
}

module.exports = getReadingList;
