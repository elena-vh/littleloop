const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// Use the SVG transformer
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer'
);

// Treat .svg as source (not asset)
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg'
);
config.resolver.sourceExts.push('svg');

module.exports = config;
