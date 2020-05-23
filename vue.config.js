module.exports = {
  pwa: {
    lang: 'es-ES',
    name: 'PLAYASBENIDORM',
    short_name: 'PLAYASBENIDORM',
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
