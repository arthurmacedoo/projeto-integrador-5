// app.config.js
// Estende o app.json. Permite publicar a versão web em um subcaminho
// (ex.: GitHub Pages → https://arthurmacedoo.github.io/projeto-integrador-5/)
// sem quebrar o build normal (Firebase Hosting / localhost, que usam a raiz).
//
// Uso:  EXPO_BASE_URL=/projeto-integrador-5 npx expo export -p web
// (o script "npm run build:gh-pages" já faz isso)
module.exports = ({ config }) => {
  const baseUrl = process.env.EXPO_BASE_URL;
  if (!baseUrl) return config;

  return {
    ...config,
    experiments: {
      ...config.experiments,
      baseUrl,
    },
  };
};
