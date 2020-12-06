/* eslint-disable no-prototype-builtins */
const ora = require('ora');
const chalk = require('chalk');
const matter = require('gray-matter');
const inquirer = require('inquirer');
const { articleFrontMatter: questions } = require('../utils/questions');

const frontMatterFields = [
  'title',
  'published',
  'description',
  'tags',
  'canonical_url',
  'cover_image',
  'series',
];

async function getMissingFrontMatter(notProvided) {
  const nothingIncluded = notProvided.length === frontMatterFields.length;
  const msg = nothingIncluded
    ? 'No front matter could be found in the file'
    : 'Some fields are missing from the front matter';
  console.log(chalk.yellow(`${msg}. Please add them: `));
  console.log(chalk.yellow('[*: required, ?: optional]'));

  const missingFrontMatter = await inquirer.prompt([
    ...questions.filter((question) => notProvided.includes(question.name)),
  ]);
  return missingFrontMatter;
}

// eslint-disable-next-line consistent-return
async function parseArticleDetails(pathToMarkdownFile) {
  try {
    if (pathToMarkdownFile.split('.').pop() !== 'md') {
      const NO_MD_FILE_ERROR = new Error('Please choose a Markdown file.');
      throw NO_MD_FILE_ERROR;
    }
    const parsed = matter.read(pathToMarkdownFile);
    const { data, content } = parsed;
    const frontMatter = { ...data, tags: data.tags.split(',') };
    const notProvided = frontMatterFields.filter(
      (field) => !parsed.data.hasOwnProperty(field)
    );
    const missingFrontMatter = await getMissingFrontMatter(notProvided);

    const article = {
      ...frontMatter,
      ...missingFrontMatter,
      body_markdown: content,
    };
    return article;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(chalk.red('No such file found. Please retry with a proper Markdown file.'));
      process.exit();
    }
    console.log(chalk.red(error.message));
    process.exit();
  }
}

async function postArticle(pathToMarkdownFile) {
  // eslint-disable-next-line global-require
  const { axios } = await require('../utils/axios');
  const article = await parseArticleDetails(pathToMarkdownFile);
  const spinner = ora('Posting your article...').start();
  try {
    const res = await axios.post('/articles', { article });
    spinner.succeed(
      chalk.green(
        `📝 Successfully posted your article at ${chalk.underline(
          res.data.url
        )}`
      )
    );
  } catch (error) {
    spinner.fail(chalk.red(error?.response?.data?.error).toString());
  }
  return null;
}

module.exports = postArticle;
