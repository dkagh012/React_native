module.exports = function (api) {
  api.cache(true);

  const presets = [
    // Add your presets here
    // 'babel-preset-env',
    // 'babel-preset-react',
    "babel-preset-expo",
  ];

  const plugins = [
    // Add your plugins here
  ];

  return {
    presets,
    plugins,
  };
};
