# Introductions
If you are on the «infect-mobile-app» repository: This repository is a **master and should only be used for forks!**

# Setup

## General
- `npm i`
- `npm i -g expo-cli`

## Initialize the Fork (copy dist files)
- `./initFork.sh`

## What to Edit (not optional)
- package.json
  - name
- app.json
  - name
  - slug
  - ios.bundleIdentifier
  - android.package
- config.js
  - api endpoints if needed
  - appKeys.googleAnalytics
- src/helpers/tenantColors.js
  - colors you want to change
- src/components/logos/LoadingScreenLogo.js
  - the svg logo for the loading/splash screen
- src/components/logos/MatrixLogo.js
  - the svg logo for the matrix view component

## If you are in a fork repository
- Add upstream: `git remote add upstream git@github.com:infect-org/infect-mobile-app.git`
- If you want to merge the master from the upstream repository:
  - `git fetch upstream`
  - `git merge upstream/master`
- If you want to commit your copied dist files so all developers have the same config.js etc.
  - Remove the corresponding entries in the .gitignore file
  - The files would never be overriden as they do not exist in the master repository

# Start the App
- `npm start`
- Test locally with a simulator or use [Expo](https://expo.io/) client on your mobile phone

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
