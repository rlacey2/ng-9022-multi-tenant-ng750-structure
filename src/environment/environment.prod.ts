
/*
The file contents for the current environment will overwrite these during build.

This code defines environment-specific settings (like app version and mode) that Angular swaps out when
building your app for development versus production.
Here is what is happening step by step:
1. Pulling the version number: It imports package.json to automatically grab your app's current version number 
(packageJson.version), saving you from updating it manually in multiple places.
2. Setting environment flags: It exports an environment object containing variables your app can read while 
running—specifically indicating that this is a development (DEV) build and not production (production: false).
3. Swapping files at build time (The Comments): The comments explain how Angular uses different versions of 
this file depending on how you build the app. When building for live users, Angular overwrites this file with a
separate production file (where production: true).
*/


import packageJSON from '../../package.json';

export const environment = {
  appName: 'ng750beta',
  envName: 'DEV',
  production: false,
  versions: {
    app: packageJSON.version
  }
};