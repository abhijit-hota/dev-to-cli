const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs').promises;
const { default: axios } = require('axios');

async function saveAuthToken(answers) {
  await fs.writeFile('config.json', JSON.stringify(answers));
  console.log(chalk.green('✅ Saved Auth Token'));

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
          await axios.get('https://dev.to/api/followers/users', {
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
    const content = await fs.readFile('config.json');
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

module.exports = { getAuthToken, saveAuthToken };
