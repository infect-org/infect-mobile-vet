# Introductions
If you are on the «infect-mobile-app» repository: This repository is a **master and should only be used for forks!**

# Setup

## General
- `npm i`
- `npm i -g expo-cli`

## Initialize the Fork (copy dist files)
- `./initFork.sh`

## What to Edit (not optional)
- app.json
  - name
  - slug
  - ios.bundleIdentifier
  - android.package
  - android.versionCode
  - version
  - sdkVersion: the version may change, check with app.json.dist
  - use this file for version management (do not edit the package.json)
- src/config.js
  - appKeys.googleAnalytics
- src/config/baseURL.js
  - the base url / domain of your api
- src/helpers/tenantColors.js
  - colors you want to change for your tenant
- src/components/logos/LoadingScreenLogo.js
  - the svg logo for the loading/splash screen
- src/components/logos/MatrixLogo.js
  - the svg logo for the matrix view component
- assets/icon.png
  - your app's icon
- assets/splash.png
  - your app's splash screen

## If you are in a fork repository
- Add upstream: `git remote add upstream git@github.com:infect-org/infect-mobile-app.git`
- If you want to merge the master from the upstream repository:
  - `git fetch upstream`
  - `git merge upstream/master`
- If you want to commit your copied dist files so all developers have the same config.js etc.
  - Remove the corresponding entries in the .gitignore file
  - The files should never be overriden as they do not exist in the master repository

# Start the App
- `npm start`
- Test locally with a simulator or use [Expo](https://expo.io/) client on your mobile phone

# Releases
- Update version in `app.json`
- Copy changes in `app.json` to `app.json.dist`
- Update android version (Integer) in `app.json` **if** you plan a google play release
- `git tag` & Co.
- Publish to the **correct** channel: `expo p --release channel testing`
- Publish to the app store (if needed, e.g. SDK version or splash screen changes)

# Release Channels
We have 3 release channels: 
- `production` for the live environment (apps that can be downloaded from stores)
- `staging` for TestFlight
- `testing` for tests through Expo
