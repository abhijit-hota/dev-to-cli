const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs').promises;
const { default: axios } = require('axios');

const DEVTO_PATH = `${process.env.HOME}/.devto`;
const DEVTO_CONFIG_PATH = `${process.env.HOME}/.devto/config.json`;

async function saveAuthToken(answers) {
  try {
    await fs.access(DEVTO_PATH);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(DEVTO_PATH);
    }
  } finally {
    await fs.writeFile(DEVTO_CONFIG_PATH, JSON.stringify(answers));
    console.log(chalk.green(`✅ Saved Auth Token to ${DEVTO_CONFIG_PATH}`));
  }

  return true;
}

async function askAuthToken() {
  const answers = await inquirer.prompt([
    {
      message: 'Your Dev.to API Key',
      name: 'authToken',
      validate: async (value) => {
        const is24Chars = value.length === 24;
        if (!is24Chars) {
          return '❌ Invalid API Key.';
        }
        try {
          await axios.get('https://dev.to/api/users/me', {
            headers: {
              api_key: value,
            },
          });

          return true;
        } catch (error) {
          if (error?.response?.status === 401) {
            return '❌ Invalid API Key.';
          }
          return undefined;
        }
      },
    },
  ]);
  await saveAuthToken(answers);
  return answers;
}

async function getAuthToken() {
  try {
    const content = await fs.readFile(DEVTO_CONFIG_PATH);
    const configObj = JSON.parse(content.toString());
    return configObj.authToken;
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      const { authToken } = await askAuthToken();
      return authToken;
    }
    return undefined;
  }
}

async function resetAuthToken() {
  try {
    await fs.access(DEVTO_CONFIG_PATH);
    await fs.unlink(DEVTO_CONFIG_PATH);
    console.log(chalk.green(`✅ Deleted Auth Token from ${DEVTO_CONFIG_PATH}`));
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(chalk.blueBright('No Auth Token to delete!'));
    }
  }
}

module.exports = {
  getAuthToken,
  saveAuthToken,
  resetAuthToken,
  askAuthToken,
};
