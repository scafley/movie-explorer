const fs = require('fs');
const path = 'src/environments/environment.ts';

const content = `export const environment = {
  tmdb: {
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p',
    accessToken: '${process.env.TMDB_TOKEN ?? ''}',
  },
};
`;

fs.writeFileSync(path, content);
console.log('environment.ts wygenerowany z tokenem z env');
