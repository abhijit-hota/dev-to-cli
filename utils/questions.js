const questions = {
  authToken: [
    {
      message: 'Your Dev.to API Key',
      name: 'authToken',
      validate: function name(value) {
        const isValidAPIKey = value.length === 24;
        return isValidAPIKey || 'Invalid API Key.';
      },
    },
  ],
  articleFrontMatter: [
    {
      name: 'title',
      message: 'Title',
      validate: (value) => value !== '' || '❌ Title cannot be blank',
      prefix: '*',
    },
    {
      name: 'description',
      message: 'Description',
    },
    {
      name: 'tags',
      message: 'Tags (Max 4, Separate by comma)',
      filter: (value) => value.split(','),
      validate: (tagArr) => {
        const isLessThan4 = tagArr.length <= 4;
        if (!isLessThan4) {
          return 'Maximum of 4 tags allowed';
        }
        return (
          !tagArr.some((tag) => tag.match(/[^\w]|_/g))
          || 'ASCII characters only'
        );
      },
    },
    {
      name: 'series',
      message: 'Series',
    },
    {
      name: 'canonical_url',
      message: 'Canonical URL. The link to your own blog.',
    },
    {
      name: 'cover_image',
      message: 'Cover Image URL',
    },
    {
      type: 'confirm',
      name: 'published',
      message: 'Publish the article?',
      prefix: '*',
      default: false,
    },
  ],
};

module.exports = questions;
