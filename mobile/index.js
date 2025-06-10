/**
 * Quantum AI Trading Platform - React Native Entry Point
 * Leverages Cloudflare free tier and GitHub Pages for optimal performance
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './package.json';

// Polyfills for crypto and random values
import 'react-native-get-random-values';

AppRegistry.registerComponent(appName, () => App);