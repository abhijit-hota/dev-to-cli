const ora = require('ora');
const chalk = require('chalk');

async function getFollowers() {
  // eslint-disable-next-line global-require
  const { axios } = await require('../utils/axios');
  const spinner = ora(chalk.cyan('Fetching your followers').toString()).start();
  try {
    const res = await axios.get('followers/users');
    const followers = res.data;
    spinner.stop();

    console.log(chalk.cyan('Your Followers:'));

    const outputList = followers
      .map((follower) => `• ${follower.name}`)
      .join('\n');
    console.log(outputList);
  } catch (error) {
    spinner.stop();
    console.log(error.response && error.response);
    console.log(error.message && error.message);
    console.log(error.stack && error.stack);
  }
}

module.exports = getFollowers;
