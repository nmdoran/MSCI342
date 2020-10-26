const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://daligvqcctaqsd:873faae85e7344cb904b3391f8572b4f740bf58ff535fc072b41112b88b73083@ec2-50-17-197-184.compute-1.amazonaws.com:5432/d7h6tjbgnjk8vl",
  ssl: {
    rejectUnauthorized: false
  }
});
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000

var jsonParser = bodyParser.json();

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/addProduct', (req, res) => res.render('pages/addProduct'))
  .post('/addProduct', jsonParser, async function(req, res) {
    try {
      const client = await pool.connect();
      client.query(`insert into fridge_products
                      values(1
                      ,(select prod_id from products where prod_name = '${req.body.product}')
                      ,current_date
                      ,current_date + (select lifetime from products where prod_name = '${req.body.product}')
                      , ${req.body.quantity}
                      , 'each');`)
      client.release();
      res.send("Success! " + res);
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .post('/removeProduct', jsonParser, async function(req, res) {
    try {
      const client = await pool.connect();
      client.query(`delete from fridge_products where user_ID = '1' AND prod_id=(select prod_id from products where prod_name = '${req.body.product}');`)
      client.release();
      res.send("Success! " + res);
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/users', function(req, res) {
    console.log("Requesting...")
    request('https://jsonplaceholder.typicode.com/users', function(error, response, body) {
        // console.log(error);
        // console.log(response);
        // console.log(body);
        res.json(body)
      });
  })
  .post('/addRow', jsonParser, async function(req, res) {
    console.log(req.body)
    console.log(req.body.id, req.body.name)
    try {
      const client = await pool.connect();
      client.query(`INSERT into test_table values (${req.body.id}, '${req.body.name}')`);
      client.release();
      res.send("Success! " + res);
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .post('/deleteRow', jsonParser, async function(req, res) {
    console.log(req.body)
    console.log(req.body.id)
    try {
      const client = await pool.connect();
      client.query(`DELETE from test_table where id=${req.body.id}`);
      client.release();
      res.send("Success! " + res);
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  
  })

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
