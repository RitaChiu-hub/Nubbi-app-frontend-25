const fs = require("fs");

const filePath =
  "./node_modules/react-native-reanimated/lib/module/index.web.js";

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const exportPattern = /export { _default as default };/g;
  const insertLine = "export default _default;"; //"";

  const modifiedData = data.replace(exportPattern, (match) => {
    if (match === "export { _default as default };") {
      return `// ${match}\n${insertLine}`;
    }
    return match;
  });

  fs.writeFile(filePath, modifiedData, "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("File modified successfully!");
  });
});
