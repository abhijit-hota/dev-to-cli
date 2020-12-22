/* eslint-disable no-prototype-builtins */
const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
const open = require('open');

async function showArticleList(articles, numItems) {
  const { articleURL } = await inquirer.prompt({
    type: 'list',
    name: 'articleURL',
    message: chalk.cyan('Your Articles List:').toString(),
    choices: [
      ...articles.map((article) => ({
        name: article.title,
        value: article.url,
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

async function getArticles(page, scope) {
  // eslint-disable-next-line global-require
  const { axios } = await require('../utils/axios');
  const spinner = ora(`Getting your articles (${scope})...`).start();
  try {
    const res = await axios.get(`/articles/me/${scope}?page=${page}`);
    spinner.succeed(
      chalk.green(`📝 ${scope} articles. ${res.data.length} articles found.`)
    );
    if (res.data.length > 0) {
      const articleURL = await showArticleList(res.data, 10);
      if (articleURL !== 'loadmore') await open(articleURL, { wait: true });
      else await getArticles(page + 1, 10);
    }
  } catch (error) {
    spinner.fail(chalk.red(error?.response?.data?.error).toString());
  }
  return null;
}

module.exports = getArticles;
