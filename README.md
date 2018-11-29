# Releases

- Update version in `package.json` and `app.json`
- Update android version (Integer) in `app.json` **if** you plan a google play release
- `git tag` & Co.
- Publish to **correct** channel: `expo p --release channel testing`
- Publish to app store (if needed, e.g. SDK version or splash screen changes)

# Release Channels

We have 3 release channels: 
- `production` for the live environment (apps that can be downloaded from stores)
- `staging` for TestFlight
- `testing` for tests through Expo

# Setup

- `cp config.js.dist config.js`
- Get credentials from [Felix](mailto:felix@joinbox.com) and update your config.js
- `npm i`
- `npm i -g expo-cli`
- `npm start`
- Test locally with a simulator or use [Expo](https://expo.io/) client on your mobile phone