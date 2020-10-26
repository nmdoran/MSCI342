//this file is meant to take a search request from user and search for it in database

//test how to read input with prompt function
	//const prompt = require ('prompt-sync')(); 
	//const name  = prompt("What item are you looking for?");
	//console.log("Here is " + name + " from the database");

//SQL query to get the user input from the database
//trying out the .get that should go to index.js to test the search functionality
.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT Prod_name FROM products WHERE Prod_name='${name}'');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

/*$.ajax({
    type: "GET",
    url: '/getProducts',
    dataType: "json",
    success: function(res) {
        console.log(res);
        console.log("Success!");
        console.log("Products:", res.results)
        autocomplete(res.results);
    },
    error: function(res) {
      console.log("Fail!", res)
    }
  });
  
  function autocomplete(products) {
    console.log("Autocompleting", products)
  }

*/
const search = document.getElementByid('search');
const matchList = document.getElementByid('match-list');


//search the data and filter it
const searchNames = async searchText => {
	const response = await fetch('Products.json');
	const names = await response.json();
	console.log(names);

};
search.addEventListener('input', () => searchNames(search.value));


//get matches to current text input
//let matches = states.filter(state => {
	//const regex = new RegExp(`^${seachText}`, 'gi');
	//return Products.prod_name.match(regex);

//});
	//if(searchText.length===0){
	//matches =[];
//}
//};
//outputHtml(matches);
	//};

//const outputHtml = matches => {
	//if(matches.length > 0 ){
	//	const html = matches.map(match =>)
	//}
/*}


search.addEventListener('input', () => searchNames(search.value));