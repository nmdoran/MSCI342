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
  .get('/', jsonParser, async (req, res) => {
    try {
      if (req.query.expirysort){
        const client = await pool.connect();
      const result = await client.query(`SELECT p.prod_name, f.exp_dt, f.qty, p.type
  FROM fridge_products f
  INNER JOIN products p ON f.prod_ID = p.prod_ID
  ORDER BY exp_dt ${req.query.expirysort}`)
  const results = { 'results': (result) ? result.rows : null};
  res.render('pages/index', results );
  client.release();
} else {
      const client = await pool.connect();
      const result = await client.query(`SELECT prod_name, type, exp_dt, qty FROM fridge_products NATURAL JOIN products`);
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/index', results );
      client.release();
  }  } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
})

  .get('/db', jsonParser, async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query(`SELECT * FROM products where prod_name='${req.query.searchParam}'`);
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
  .post('/checkfridge', jsonParser, async function(req, res) { //create a "post" method to check fridge products (product name, quantity, expiry date)
      console.log(req.body)
      console.log(req.body.id)
      try {
        const client = await pool.connect();
        client.query(`SELECT p.prod_name, f.qty, f.exp_date FROM fridge_products f
          LEFT JOIN products p ON p.prod_ID = f.prod_ID
          WHERE user_ID = '1'`); //query that will pull product name, quantity and expiry date from respective databaes
        client.release();
        res.send("Success! " + res); //if its successful
      } catch (err) {
        console.error(err); //if there is an error
        res.send("Error " + err);
      }

  })

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
