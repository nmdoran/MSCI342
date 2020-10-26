const { spawn } = require('child_process');
const got = require('got');
const test = require('tape');

// Start the app
const env = Object.assign({}, process.env, {PORT: 5000});
const child = spawn('node', ['index.js'], {env});

test('index page responds to requests', (t) => {

  // Wait until the server is ready
  child.stdout.on('data', _ => {
    // Make a request to app main page
    (async () => {
      const response = await got('http://127.0.0.1:5000/');
      // stop the server
      child.kill();
      // No error
      t.false(response.error);
      // Successful response
      t.equal(response.statusCode, 200);

      // Assert content checks
      t.notEqual(response.body.indexOf("<title>Main Page</title>"), -1);
      t.notEqual(response.body.indexOf("Main Page"), -1);

      // Ensure greeting welcome date is correct
      // **Note that currently this just sees the script for the date and not the date itself, so it is not currently working
      // **Need to migrate to a testing plugin where we can actually manipulate the page itself
      var todayDate = Date.now().toLocaleString();
      t.equal(response.body.indexOf(todayDate), -1);

    })();
  });

  t.end()
});

test('add products page responds to requests', (t) => {

  // Wait until the server is ready
  child.stdout.on('data', _ => {
    // Make a request to app main page
    (async () => {
      const response = await got('http://127.0.0.1:5000/addProduct');

      t.false(response.error);
      // Successful response
      t.equal(response.statusCode, 200);

      // Assert content checks
      t.notEqual(response.body.indexOf("<title>What's Cookin'?</title>"), -1);
      t.notEqual(response.body.indexOf("What's Cookin'?"), -1);

    })();
  });

  t.end();
});
