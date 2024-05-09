module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-web",
      ["@babel/plugin-proposal-object-rest-spread", { loose: false }],
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
    ],
    //  plugins: ["react-native-reanimated/plugin"],
  };
};
