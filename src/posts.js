import slugify from 'slugify';

const entries = [
  {
    id: 1,
    title: 'Improving productivity in the terminal with pipes',
    url: `${process.env.REACT_APP_MARKDOWN}/Improving%20productivity%20in%20the%20terminal%20with%20pipes.md`,
    summary: 'Make life in the terminal easiser with Unix tools 🍏🛠🐧.',
    date: 'Feb 9, 2020'
  }
];

const posts = entries.reduce(
  (acc, post) => ({
    byID: { ...acc.byID, [post.id]: post },
    byTitle: {
      ...acc.byTitle,
      [slugify(post.title, { lower: true })]: { id: post.id }
    }
  }),
  { byID: {}, byTitle: {} }
);

export default posts;
