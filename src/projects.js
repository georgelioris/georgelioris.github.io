const projects = [
  {
    id: 1,
    title: 'ZeroStore',
    desc:
      'Simple ecommerce frontend using React and Materialize. State management handled with Redux. Components and functions tested with Jest and React Testing Library',
    url: 'https://zerostore.netlify.app/',
    img: [
      require('./assets/media/zstore768w.png'),
      require('./assets/media/zstore768w2.png')
    ],
    tech: ['react', 'redux', 'jest'],
    sources: ['https://github.com/georgelioris/zerostore']
  },
  {
    id: 2,
    title: 'Algovis',
    desc: 'Sorting algorithms implemented in JS and visualized in React.',
    url: 'https://algovis.netlify.app/',
    img: [
      require('./assets/media/algovis768w.png'),
      require('./assets/media/algovis768w2.png')
    ],
    tech: ['react', 'sorting algorithms'],
    sources: ['https://github.com/georgelioris/algovis']
  },
  {
    id: 3,
    title: 'Aerity',
    desc:
      'Weather information app powered by DarkSky and OpenWeather. The backend is an Express server wrapped in a netlify serverless function. Supports requests by location name or geographic coordinates. Frontend built with React and Grommet.',
    url: 'https://aerity.netlify.app/',
    img: [
      require('./assets/media/aerity768w.png'),
      require('./assets/media/aerity768w2.png')
    ],
    tech: ['react', 'rest-api', 'express', 'serverless'],
    sources: [
      'https://github.com/georgelioris/aerity-client',
      'https://github.com/georgelioris/aerity-server'
    ]
  }
];

export default projects.reverse();
