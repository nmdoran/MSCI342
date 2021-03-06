const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://daligvqcctaqsd:873faae85e7344cb904b3391f8572b4f740bf58ff535fc072b41112b88b73083@ec2-50-17-197-184.compute-1.amazonaws.com:5432/d7h6tjbgnjk8vl",
  ssl: {
    rejectUnauthorized: false
  }
});
const request = require('request');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000
const passport = require('passport');

var userProfile;
var jsonParser = bodyParser.json();

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
  }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

  .get('/', jsonParser, async (req, res) => {
    try {
      var userID = userProfile ? userProfile.id : 1;
      if (req.query.type) {
        const client = await pool.connect();
        const result = await client.query(`SELECT prod_name, type, exp_dt, qty, p.user_id FROM fridge_products f LEFT JOIN products p on p.prod_ID=f.prod_ID WHERE f.user_ID IN ('0', '${userID}') AND Type='${req.query.type}'`);
        const searchresult = await client.query(`SELECT * FROM products WHERE upper(prod_name) LIKE upper('${req.query.searchParam}') AND user_ID IN ('0','${userID}')`);
        const results = { 'results': (result) ? result.rows : null, 'searchresults': (searchresult && req.query.searchParam) ? searchresult.rows : "nosearch", 'userProfile': userProfile };
        res.render('pages/index', results );
        client.release();
      } else if (req.query.expirysort) {
        const client = await pool.connect();
        const result = await client.query(`SELECT p.prod_name, f.exp_dt, f.qty, p.type, p.user_id
        FROM fridge_products f
        INNER JOIN products p ON f.prod_ID = p.prod_ID
        WHERE f.user_ID = '${userID}'
        ORDER BY exp_dt ${req.query.expirysort}`)
        const searchresult = await client.query(`SELECT * FROM products where upper(prod_name)=upper('${req.query.searchParam}') AND user_ID IN ('0', '${userID}')`);
        const results = { 'results': (result) ? result.rows : null, 'searchresults': (searchresult && req.query.searchParam) ? searchresult.rows : "nosearch", 'userProfile': userProfile };
        res.render('pages/index', results );
        client.release();
      } else {
        const client = await pool.connect();
        const result = await client.query(`SELECT prod_name, type, exp_dt, qty, p.user_id FROM fridge_products f LEFT JOIN products p on p.prod_ID=f.prod_ID WHERE f.user_ID IN ('0', '${userID}')`);
        const searchresult = await client.query(`SELECT * FROM products where prod_name ILIKE upper('%${req.query.searchParam}%') AND user_ID IN ('0','${userID}')`);
        const results = { 'results': (result) ? result.rows : null, 'searchresults': (searchresult && req.query.searchParam) ? searchresult.rows : "nosearch", 'userProfile': userProfile };
        res.render('pages/index', results );
        client.release();
      }
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
})

  .post('/editFridgeItem', jsonParser, async function(req, res) {
    try {
      const client = await pool.connect();
      if (req.body.quantity) {
        client.query(`UPDATE fridge_products
        SET qty = '${req.body.quantity}'
        WHERE prod_id = (select prod_id from products where prod_name = '${req.body.product}')`)
      }
      if (req.body.expirydate) {
        client.query(`UPDATE fridge_products
        SET exp_dt = '${req.body.expirydate}'
        WHERE prod_id = (select prod_id from products where prod_name = '${req.body.product}')`)
      }
      if (req.body.type) {
        client.query(`UPDATE products
        SET type = '${req.body.type}'
        WHERE prod_id = (select prod_id from products where prod_name = '${req.body.product}')`)
      }
      client.release();
      res.send("Success! " + res);
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .get('/editQuantity', (req, res) => res.render('pages/editQuantity'))
  .post('/editQuantity', jsonParser, async function(req, res) {
    try {
      var userID = userProfile ? userProfile.id : 1;
      const client = await pool.connect();
      client.query(`UPDATE fridge_products
        SET qty = '${req.body.quantity}'
        WHERE prod_id = (select prod_id from products where prod_name = '${req.body.product}') AND user_ID = '${userID}'`)
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
      var userID = userProfile ? userProfile.id : 1;
      const client = await pool.connect();
      client.query(`UPDATE fridge_products
        SET exp_dt = '${req.body.expirydate}'
        WHERE prod_id = (select prod_id from products where prod_name = '${req.body.product}') AND user_ID = '${userID}'`)
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
      var userID = userProfile ? userProfile.id : 1;
      const client = await pool.connect();
      client.query(`insert into fridge_products
                      values('${userID}'
                      ,(select prod_id from products where prod_name = '${req.body.product}')
                      ,current_date
                      ,current_date + (select lifetime from products where prod_name = '${req.body.product}')
                      , ${req.body.quantity}
                      , 'each');`, function(err, data) {
                        if (err && err.code == '23505') {
                          res.send("error: duplicate product");
                        } else if (err) {
                          res.send("error: unknown")
                        } else {
                          res.send("successfully added")
                        }
                      })
      client.release();
    } catch (err) {
      res.send(err);
    }
  })
  .post('/removeProduct', jsonParser, async function(req, res) {
    try {
      var userID = userProfile ? userProfile.id : 1;
      const client = await pool.connect();
      client.query(`delete from fridge_products where user_ID = '${userID}' AND prod_id=(select prod_id from products where prod_name = '${req.body.product}');`)
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
      var userID = userProfile ? userProfile.id : 1;
      //var userID = '1'
      const client = await pool.connect();
      await client.query(`SELECT * FROM products WHERE user_id IN ('0', '${userID}') AND prod_name = '${req.body.product_name}'`, (err, data) => {
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

  .post('/removeCustom', jsonParser, async function(req, res) {
    try {
      const client = await pool.connect();
      client.query(`DELETE FROM products WHERE user_ID IN ('0', '${req.body.userID}') AND prod_name = '${req.body.product}'`);
      client.release();
      res.send("Success!");
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .get('/editProfile', jsonParser, async (req, res) => {
    try {
      var userID = userProfile ? userProfile.id : 1;
      const client = await pool.connect();
      const result = await client.query(`SELECT name, email, postal_code, email_freq FROM Users where user_ID = '${userID}'`);
      const results = { 'results': (result) ? result.rows : null, 'searchresults': (result) ? result.rows : null};
      res.render('pages/editProfile', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
   .post('/editProfile', jsonParser, async function(req, res) {
    try {
      var userID = userProfile ? userProfile.id : 1; 
      const client = await pool.connect();
      if(req.body.username){
        client.query(`update users set name = '${req.body.username}' where user_ID = '${userID}'`)
      }
      if(req.body.email){
        client.query(`update users set email = '${req.body.email}' where user_ID = '${userID}'`)
      }
      if(req.body.postal_code){
        client.query(`update users set postal_code = '${req.body.postal_code}' where user_ID = '${userID}'`)
      }
      client.release();
      res.send("Success!");
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .get('/signinpage', (req, res) => res.render('pages/signinpage'))

  .get('/foodDonation', (req, res) => res.render('pages/foodDonation'))

  .get('/recipePage', (req, res) => res.render('pages/recipePage'))

  .post('/getProducts', jsonParser, async (req, res) => {
    var userID = userProfile ? userProfile.id : 1;
    const client = await pool.connect();
    await client.query(`SELECT json_agg(prod_name) FROM fridge_products f LEFT JOIN products p on p.prod_ID=f.prod_ID WHERE f.user_ID IN ('0', '${userID}')`, function(err, data) {
      client.release();
      res.send(data.rows);
    });
  })

  .post('/getFridgeProduct', jsonParser, async (req, res) => {
    const client = await pool.connect();
    await client.query(`SELECT * FROM fridge_products f LEFT JOIN products p on p.prod_ID=f.prod_ID WHERE f.user_ID IN ('0', '${req.body.userID}') AND p.prod_name = '${req.body.product}'`, function(err, data) {
      client.release();
      res.send(data.rows);
    });
  })

  .post('/getProduct', jsonParser, async (req, res) => {
    const client = await pool.connect();
    await client.query(`SELECT * FROM products WHERE user_ID IN ('0', '${req.body.userID}') AND prod_name = '${req.body.product}'`, function(err, data) {
      client.release();
      res.send(data.rows);
    });
  })

  .post('/getUserProfile', jsonParser, async (req, res) => {
    const client = await pool.connect();
    await client.query(`SELECT * FROM users WHERE user_ID ='${req.body.userID}'`, function(err, data) {
      client.release();
      res.send(data.rows);
    });
  })

  .post('/getUserProfilesByName', jsonParser, async (req, res) => {
    const client = await pool.connect();
    await client.query(`SELECT * FROM users WHERE user_ID <> '1' and name = '${req.body.name}'` , function(err, data) {
      client.release();
      res.send(data.rows);
    });
  })
 
  .post('/getUserProfilesByEmail', jsonParser, async (req, res) => {
    const client = await pool.connect();
    await client.query(`SELECT * FROM users WHERE user_ID <> '1' and email = '${req.body.email}'` , function(err, data) {
      client.release();
      res.send(data.rows);
    });
  })

  // login setup

  .use(passport.initialize())
  .use(passport.session())

  .get('/error', (req, res) => res.send("error logging in"))

  .get('/auth/google',
    passport.authenticate('google', { scope : ['profile', 'email'] }))

  .get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function(req, res) {
      // Successful authentication, redirect success.
      res.redirect('/');
    })

  .get('/logout', function(req, res) {
    req.logout();
    userProfile = null;
    res.redirect('/signinpage');
  })


  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

  // google authorization

  const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  const GOOGLE_CLIENT_ID = '428407383068-nec4si48ja9r4pahl3ohp4rtq3cc8v7m.apps.googleusercontent.com';
  const GOOGLE_CLIENT_SECRET = 'bhdFRmNBMRdiO4BUozBvedZC';
  passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
        const client = await pool.connect();
        // Checks if the user who just signed in has been registered. If they have not, register them in the users table
        client.query(`SELECT * FROM users WHERE user_id = '${profile.id}'`, function (err, data) {
          if (data.rowCount == 0) {
            console.log("Registering a new user with ID " + profile.id);
            client.query(`INSERT into users values('${profile.id}', '${profile.displayName}', '${profile.emails[0].value}', 'A1A1A1', 0)`);
          } else {
            console.log("Recognized user signing in with ID " + profile.id);
          }
        });
        client.release();
        userProfile=profile;
        return done(null, userProfile);
    }
  ));
