# MSCI342
MSCI 342 Term Project Group 14

A Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

The live version of the application can be found at https://whatscookinggoodlooking.herokuapp.com/

## First Time Setup
Download and install the latest versions of the following:
- [Git](https://git-scm.com/)
- [Node.js](http://nodejs.org/)
- [Heroku CLI](https://cli.heroku.com/)
- A code editor of your choice (Visual Studio Code, Vim, Atom, Sublime, etc.)

You can confirm that these services have been successfully installed by opening the Command Prompt on Windows or Terminal on MacOS and entering "git --version", "node --version", and "heroku --version" (without the quotes). Each of these should return the version number that you have installed.

If you have not used git on your computer before, you may need to undergo some first time setup steps to get it up and running as well as connect it to your GitHub account, instructions can be found on the [GitHub Docs](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/set-up-git) or elsewhere online.

For setting up Heroku, please create a free account at https://signup.heroku.com/ and then follow the instructions in the [setup guide](https://devcenter.heroku.com/articles/heroku-cli#getting-started) to link your account with the Heroku command line interface.

Once the above has been completed, use Command Prompt or Terminal to navigate to the directory folder where you would like to hold the local code repository on your computer. You can do this using the "cd" command, which navigates your command line interpreter to the directory you specify. The easiest way to do this is probably by copying the full path of the directory from file explorer/finder, and then pasting it directly into Command Prompt. For example, the entered command could be "cd C:\Users\<your-username-here>\Documents\GitHub".

Once you have navigated to your folder of choice, run the following into Command Prompt:

```sh
$ git clone https://github.com/nmdoran/MSCI342.git
$ cd MSCI342
$ npm install
```

These commands copy the project repository onto your computer, navigate your command prompt into the repo folder, and lastly install the necessary code packages.

To run the application locally in your browser, ensure your command prompt is still navigated to the project folder and then run the following command:

```
$ npm start
```

The app should now be running on [localhost:5000](http://localhost:5000/). By opening your web browser to this link, you should see the application and can make live changes according to your local code.

## Deploying to Heroku

```
$ heroku create
$ git push heroku main
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)