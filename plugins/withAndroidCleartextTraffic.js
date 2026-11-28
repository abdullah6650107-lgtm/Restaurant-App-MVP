const { withAndroidManifest } = require("expo/config-plugins");

module.exports = function withAndroidCleartextTraffic(config) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";
  if (!apiUrl.startsWith("http://")) return config;

  return withAndroidManifest(config, (modConfig) => {
    const application = modConfig.modResults.manifest.application?.[0];
    if (!application) {
      throw new Error("Android manifest is missing its application element.");
    }

    application.$["android:usesCleartextTraffic"] = "true";
    return modConfig;
  });
};
