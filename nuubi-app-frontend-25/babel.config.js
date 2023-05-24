module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "add-react-displayname",
      "./node_modules/@freshpaint/freshpaint-react-native/plugin.js",
    ],
  };
};
