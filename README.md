# Releases

- Update version in `package.json` and `app.json`
- Update android version (Integer) in `app.json`
- `git tag` & Co.
- Publish to **correct** channel: `expo p --release channel test`
- Publish to app store if SDK version changes

# Channels

We have 3 release channels: 
- `production` for the live environment (apps that can be downloaded from stores)
- `staging` for TestFlight
- `test` for tests through Expo

# Setup

- `cp config.js.dist config.js`
- Get credentials from [Felix](mailto:felix@joinbox.com) and update your config.js
- `npm i`
- `npm i -g expo-cli`
- `npm start`
- Test locally with a simulator or use [Expo](https://expo.io/) client on your mobile phone. 
