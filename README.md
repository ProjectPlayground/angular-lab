# Angular 2 Laboratory

[![Build Status](https://travis-ci.org/rolandjitsu/ng2-lab.svg?branch=master)](https://travis-ci.org/rolandjitsu/ng2-lab)
[![Dependency Status](https://gemnasium.com/rolandjitsu/ng2-lab.svg)](https://gemnasium.com/rolandjitsu/ng2-lab)
[![Join the chat at https://gitter.im/rolandjitsu/ng2-lab](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/rolandjitsu/ng2-lab?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
> Playground for experimenting with some of the core features of [Angular 2.0](https://angular.io) and integration with other software and services.

This setup is using:
* [TypeScript](http://www.typescriptlang.org)
* [SystemJS](https://github.com/systemjs/systemjs) - ES& module loader
* [Angular 2](http://angular.io/)
* [ES6 Shim](https://github.com/paulmillr/es6-shim) - necessary for browsers that haven't implemented any or some of the [ES6](http://es6-features.org) features used by Angular 2 and this project (if you require more feature coverage consider using [Core JS](https://github.com/zloirock/core-js))

Hosting:
* [Firebase](https://firebase.com) - realtime store for the app's data, authentication and hosting provider

Unit/E2E tests:
* [Protractor](https://angular.github.io/protractor) - e2e test framework
* [Karma](http://karma-runner.github.io) - test runner for the app unit tests
* [Jasmine](http://jasmine.github.io) - assertion lib

CI/CD:
* [Travis CI](https://travis-ci.org) - used as both continuous integration and delivery service for the app
* [Saucelabs](https://saucelabs.com) - browser provider for running the app tests on the CI server

Tools:
* [BrowserSync](http://browsersync.io) - used as a static webserver for local development
* [Gulp](http://gulpjs.com) - task runner

Package/Typings manager:
* [Gemnasium](https://gemnasium.com) - keeps an eye on all the project dependencies version's
* [Typings](https://github.com/typings/typings)
* [NPM](https://npmjs.com)
* [JSPM](http://jspm.io)

UI:
* [Angular 2 Material](https://github.com/angular/material2)


# Table of Contents

* [Setup](#setup)
* [Travis CI](#travis-ci)
* [Development](#development)
	* [Info](#info)
	* [Running Tests](#running-tests)
	* [Other Tasks](#other-tasks)
* [Browser Support](#browser-support)
* [Learning Material](#learning-material)
* [Credits](#credits)


### Setup
---------
Make sure you have [Node](http://nodejs.org) (*if not already installed*) then clone this repo and setup the following tools on your machine using `npm install -g <package>`:
* [JSPM](http://jspm.io)
* [Typings](https://github.com/typings/typings)
* [Gulp](http://gulpjs.com/)

**Note**: All the above tools are only necessary to install globally to avoid writing `./node_modules/.bin/<command>`/`$(npm bin)/<command>` every time you want to run a command. Users running OS X or Linux based systems (soon Windows as well) could also use tools like [direnv](http://direnv.net) to expose the local npm binaries using a `.envrc` file:
```shell
# Node Binaries
export PATH=$PATH:$PWD/node_modules/.bin
```
As a preference, I prefer not having anything installed globally and keep everything isolated per project.

After you have the above tools setup, install all runtime/dev dependencies by running:

```shell
$(node bin)/npm install
$(npm bin)/jspm install
$(npm bin)/typings install
```

**Note**: If you change any of the deps (remove/add) in either `package.json` or `typings.json`, make sure that you run the above commands again.

Now start the webserver and the build/watch processes (to watch for file changes) and the app will open in your default browser:

```shell
$(node bin)/npm start # `$(npm bin)/gulp serve`
```


### Firebase
------------
If you wish to have your own Firebase account used with this setup you have to change the `FIREBASE_APP_LINK` located in `src/app/services/constants.ts` to your own Firebase app link:

![Firebase App Link](media/firebase_app_link.png)

#### Authentication

Furthermore, the authentication implementation uses Firebase as well, thus you need to follow a few steps if you decide to use your own Firebase account.
Enable **Email & Password** authentication from the **Login & Auth** tab in your app's Firebase dashboard.

![Firebase App Link](media/firebase_auth_tab.png)

Enable **Github** and **Google** auth from the same **Login & Auth** tab and follow the instructions in the [Github](https://www.firebase.com/docs/web/guide/login/github.html) and [Google](https://www.firebase.com/docs/web/guide/login/google.html) guides.

#### Hosting

Finally, if you want to use your own Firebase's [hosting](https://www.firebase.com/docs/hosting/quickstart.html) service, then you have to do a few things in order to make it work.
First make sure that you have ran `$(node bin)/npm install` so that the [firebase-tools](https://github.com/firebase/firebase-tools) dependency is installed. Then make sure that you are logged in the Firebase dashboard and run:

```shell
$(npm bin)/firebase login
```

And follow all the steps (a browser window will be opened so you can authenticate the client). Next you will need to get the token used for authentication when a deployment is done, do this by running:

```shell
$(npm bin)/firebase prefs:token
```

Copy the token and put it somewhere safe for further usage. Also change the `"firebase": "ng2-lab"` value from `firebase.json` to the name of you Firebase app.
Now you can deploy the app to you own Firebase app by running (note that you need to build the app using `$(npm bin)/gulp build` before any deployments if there were changes to the code and it has not been build):

```shell
$(npm bin)/gulp deploy/hosting --token <your firebase token>
```

**Note**: If you use tools like [direnv](http://direnv.net/) you can export a `FIREBASE_TOKEN` which will be picked up by the `$(npm bin)/gulp deploy/hosting` so you won't need to provide the `--token` option every time you run the command.


### Travis CI
-------------
If you plan on using this setup with your own projects and you wish to setup Travis CI, then you must make sure of a couple of things in order to have everything working properly on the CI:

1. Setup and env variable `FIREBASE_TOKEN` containing the token you got from `$(npm bin)/firebase prefs:token` so that your deployments to firebase will work. If you do not use Firebase, skip this step. Also, you may want to encript the token if the source code is available for public, use the Travis [docs](https://docs.travis-ci.com/user/environment-variables/#Encrypted-Variables) to see how to do it.
2. In case you use SauceLabs, set the env var `SAUCE_USERNAME` to your own username and create a new env variable `SAUCE_ACCESS_KEY` containing the access key you can get from the SauceLabs dashboard (read more about setting up SauceLabs with Travis [here](https://docs.travis-ci.com/user/sauce-connect/)).
3. If you do not use the deployment to Firebase, remove that step from `.travis.yml`.

Now, keep in mind that cloning this repo and continuing in the same project will give you some issues with Travis if you setup your own account. So I suggest you start out with a clean project and start git from scratch (`git init`), then copy over things from this project (obviously, do not include `.git` - not visible on most UNIX base systems).


### Google Analytics
--------------------
This app is also using [Google Analytics](https://analytics.google.com) to track pageviews (and in the future some other user behaviour events); if you plan on using this app for your own purposes, please make sure to change the `NG2_LAB_TRACKING_CODE` (located in `app/services/tracker.ts`) to your own.


### Development
---------------
Bellow you can find a couple of things to help understanding how this setup works and how to make it easier when developing on this app (or starting your own and use this as a guideline).

#### Info

During development, when running the app in the browser, all TS is being compiled at runtime. Therefore, there might be a slight delay (around 15 - 20 sec) after the first page refresh, but it should run smoothly from there on.

Note that there is no build required to be able to run the app, thus all you need to get it started is `$(npm bin)/gulp serve` which will start the BrowserSync static webserver and open the app in the default browser.

Unit tests run the same way, so there is no need to rerun builds when a spec or source file is changed. For further info about unit tests read bellow.

E2E tests need no compilation as you will be writing them in ES6 and the latest versions of node have implemented most of the ES6 features.

#### Running Tests

Tests can be run selectively as it follows:

* `$(npm bin)/gulp lint`: runs [tslint](http://palantir.github.io/tslint/) and checks all `.ts` files according to the `tslint.json` rules file
* `$(npm bin)/gulp test/unit:continuous`: unit tests in a browser; runs in watch mode (i.e. watches the source files for changes and re-runs tests when files are updated)
* `$(npm bin)/gulp test/unit:single`: unit tests in a browser; runs in single run mode, meaning it will run once and it will not watch for file changes
* `$(npm bin)/gulp test/e2e:local`: e2e tests in a browser; runs in single run mode

And if you have a Saucelabs account, you can also run unit tests on some of the SL browsers provided in `browsers.config.js`. Just call `$(npm bin)/gulp test/unit:sauce --browsers=Chrome, Firefox, iOS9` (and whatever other browsers you wish) and make sure that you have the `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` env variables set. You can also pass the two env variables as options if you prefer it: `$(npm bin)/gulp test/unit:sauce --browsers=Chrome, Firefox --username=<your sauce username> --acessKey=<you sauce access key>`.

#### Other Tasks

If you just want to build everything, run `$(npm bin)/gulp build`.

And if you want to deploy the app to Firebase (security rules and app files), use `$(npm bin)/gulp deploy`. Just make sure you provide the auth token either as an env variable (`FIREBASE_TOKEN`) or as an option (`--token`).

And of course to see what other tasks are available, run `$(npm bin)/gulp --tasks`.


### Browser Support
-------------------
Even though all source code is compiled/transpiled to ES5 and some [shims](https://github.com/paulmillr/es6-shim) are provided, this app has no official indication of what browsers it supports (lack of enough unit/e2e tests).
Though, you can check out the browser support for [Angular 2](https://github.com/angular-class/awesome-angular2#current-browser-support-for-angular-2) and assume that the app will work where Angular 2 works.


### Learning Material
---------------------
* [Angular 2 Education](https://github.com/timjacobi/angular2-education)
* [Awesome Angular 2](https://github.com/angular-class/awesome-angular2)
* [Angular Docs](https://angular.io)


### Credits
-----------
In the making of this simple app, I have made use of whatever resources I could find out there (since the docs on some of the Angular 2 features usage are not that extensive and it's constantly changing for the moment), thus it's worth mentioning that the following projects have served as inspiration and help:

* [ng2-play](https://github.com/pkozlowski-opensource/ng2-play)
* [angular2-webpack-starter](https://github.com/angular-class/angular2-webpack-starter)
* [angular2-authentication-sample](https://github.com/auth0/angular2-authentication-sample)
* [ng2do](https://github.com/davideast/ng2do)
