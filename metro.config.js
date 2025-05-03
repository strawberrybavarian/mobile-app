const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix module resolution
// config.resolver = {
//   ...config.resolver,
//   extraNodeModules: new Proxy({}, {
//     get: (target, name) => {
//       return name.startsWith('@') 
//         ? path.join(process.cwd(), `node_modules/${name}`)
//         : path.join(process.cwd(), `node_modules/${name}`);
//     }
//   }),
//   // Enable symlinks for more reliable resolution
//   enableSymlinks: true,
// };

// Add TypeScript extensions to the source list
config.resolver.sourceExts = [
  'jsx',
  'js',
  'ts',
  'tsx', // Add this
  'json',
  'cjs',
  'mjs'
];

// Enable extra node modules support
// config.resolver.extraNodeModules = require('node-libs-react-native');
delete config.resolver.extraNodeModules;


module.exports = config;