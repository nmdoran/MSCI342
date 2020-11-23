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
const { query } = require('express');
const PORT = process.env.PORT || 5000

var jsonParser = bodyParser.json();

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', jsonParser, async (req, res) => {
    try {
      //console.log(req.query)
      if (req.query.type) {
        const client = await pool.connect();
        const result = await client.query(`SELECT prod_name, type, exp_dt, qty FROM fridge_products f LEFT JOIN products p on p.prod_ID=f.prod_ID WHERE f.user_ID IN ('0', '1') AND Type='${req.query.type}'`);
        const searchresult = await client.query(`SELECT * FROM products where upper(prod_name)=upper('${req.query.searchParam}') AND user_ID IN ('0','1')`);
        const results = { 'results': (result) ? result.rows : null, 'searchresults': (searchresult) ? searchresult.rows : null};
        res.render('pages/index', results );
        client.release();
      } else if (req.query.expirysort) {
        const client = await pool.connect();
        const result = await client.query(`SELECT p.prod_name, f.exp_dt, f.qty, p.type
        FROM fridge_products f
        INNER JOIN products p ON f.prod_ID = p.prod_ID
        WHERE f.user_ID = '1'
        ORDER BY exp_dt ${req.query.expirysort}`)
        const searchresult = await client.query(`SELECT * FROM products where upper(prod_name)=upper('${req.query.searchParam}') AND user_ID IN ('0', '1')`);
        const results = { 'results': (result) ? result.rows : null, 'searchresults': (searchresult) ? searchresult.rows : null};
        res.render('pages/index', results );
        client.release();
      } else {
        const client = await pool.connect();
        const result = await client.query(`SELECT prod_name, type, exp_dt, qty FROM fridge_products f LEFT JOIN products p on p.prod_ID=f.prod_ID WHERE f.user_ID IN ('0', '1')`);
        const searchresult = await client.query(`SELECT * FROM products where upper(prod_name)=upper('${req.query.searchParam}') AND user_ID IN ('0','1')`);
        const results = { 'results': (result) ? result.rows : null, 'searchresults': (searchresult) ? searchresult.rows : null};
        res.render('pages/index', results );
        client.release();
      }
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
})

  .get('/addProduct', jsonParser, async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query(`SELECT * FROM products where upper(prod_name)=upper('${req.query.searchParam}')AND user_ID IN ('0','1')`);
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/addProduct', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })


  .get('/editQuantity', (req, res) => res.render('pages/editQuantity'))
  .post('/editQuantity', jsonParser, async function(req, res) {
    try {
      const client = await pool.connect();
      client.query(`UPDATE fridge_products
        SET qty = '${req.body.quantity}'
        WHERE prod_id = (select prod_id from products where prod_name = '${req.body.product}')`)
      client.release();
      res.send("Success! " + res);
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .get('/editExpiry', (req, res) => res.render('pages/editQuantity'))
  .post('/editExpiry', jsonParser, async function(req, res) {
    try {
      const client = await pool.connect();
      client.query(`UPDATE fridge_products
        SET exp_dt = '${req.body.expirydate}'
        WHERE prod_id = (select prod_id from products where prod_name = '${req.body.product}')`)
      client.release();
      res.send("Success! " + res);
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

  .get('/addCustom', (req, res) => res.render('pages/addCustom'))
  .post('/addCustom', jsonParser, async function(req, res) {
    try {
      //var userID = userProfile ? userProfile.id : 1; 
      var userID = '1'
      const client = await pool.connect();
      await client.query(`SELECT * FROM products WHERE user_id = '${userID}' AND prod_name = '${req.body.product_name}'`, (err, data) => {
        if (data.rowCount == 0) {
          client.query(`insert into products (user_ID, prod_name, type, lifetime)
            values('${userID}'
            ,'${req.body.product_name}'
            ,'${req.body.type}'
            ,'${req.body.life}')`
        )
          client.query(`insert into fridge_products
              values('${userID}'
              ,(select prod_id from products where prod_name = '${req.body.product_name}')
              ,current_date
              ,current_date + (select lifetime from products where prod_name = '${req.body.product_name}')
              , ${req.body.quantity}
              , 'each')`
          )
          console.log("Success!")
          res.send("success")
        } else {
          console.log("Duplicate!")
          res.send("duplicate")
        }
      })
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .get('/signinpage', (req, res) => res.render('pages/signinpage'))

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
