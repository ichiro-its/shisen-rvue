module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/shisen-rvue/'
    : '/',
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    name: 'Shisen RVue',
    themeColor: '#1976D2',
  },
}