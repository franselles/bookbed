module.exports = {
  pwa: {
    lang: 'es-ES',
    name: 'HAMACAS 2020',
    short_name: 'HAMACAS 2020',
    themeColor: '#f37321',
    background_color: '#e7e552',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    display: 'standalone',
    orientation: 'portrait',
    workboxOptions: {
      skipWaiting: true,
    },
  },
  productionSourceMap: false,
};
