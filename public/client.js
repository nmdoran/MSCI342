console.log('Script file loaded successfully');

function addProduct() {
  console.log("Adding a product...")
  const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/addProduct');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'product':document.getElementById("addProduct").value, 'quantity': document.getElementById("quantity").value}));
}

function addProductFromSearch(e) {
  console.log("Adding a product...")

  var q = document.getElementById("searchedProductQuantity").value;
  if (q==""){
    alert ("Please specify a quantity");
    return false;
  }
  else if (q<=0){
    alert ("Invalid negative quantity");
    return false
  }

  else {
    const userRequest = new XMLHttpRequest();
    userRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if (this.response == "error: duplicate product") {
          alert("This product is already in your fridge. Please try a different product.")
        } else if (this.response == "error: unknown") {
          // currently fails silently, though ideally this case does not occur unless something went wrong
          location.reload();
        } else {
          location.reload();
        }
      }
    };
    userRequest.open('post', '/addProduct');
    userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    userRequest.send(JSON.stringify({'product': e.target.value, 'quantity' : document.getElementById("searchedProductQuantity").value}));
  }
}

function removeProduct(event) {
  console.log("Removing a product...", event.target.value)
  const userRequest = new XMLHttpRequest();
  userRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      location.reload();
    }
  };
  userRequest.open('post', '/removeProduct');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'product': event.target.value}));
}

function sortbyExpiry() {
  var x = document.getElementById("expirysort").value.length ? "?expirysort=" + document.getElementById("expirysort").value : "";
  if (window.location.hostname === "localhost") {
    window.location.replace("http://localhost:5000/" + x);
  } else {
    window.location.replace("https://whatscookinggoodlooking.herokuapp.com/" + x);
  }
}

function editFridgeItem(event) {
  console.log("Editing item details...")
  console.log(event.target.value)
  console.log(document.getElementById(event.target.value + "EditQuantity").value)
  console.log(document.getElementById(event.target.value + "EditExpiryDate").value)

  const userRequest = new XMLHttpRequest();
  userRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      location.reload();
    }
  };
  userRequest.open('post', '/editFridgeItem');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'product': event.target.value, 'quantity': document.getElementById(event.target.value + "EditQuantity").value, 'expirydate': document.getElementById(event.target.value + "EditExpiryDate").value}));
}

function addCustom() {
  n = document.getElementById("prod_name").value;
  t = document.getElementById("addType").value;
  l = document.getElementById("prod_life").value;
  q = document.getElementById("prod_qty").value;

  if(n == "" || t == "" || l == "" || q == ""){
    window.alert("Please add values for all fields")
  } else {
    console.log("Adding a custom product...")
    const userRequest = new XMLHttpRequest();
    userRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if (this.response == "duplicate") {
          alert("This product has already been added. Please add it to your fridge using the search function on the main page.")
        } else if (this.response == "success") {
          alert("Successfully added!")
        }
      }
    };
    userRequest.open('post', '/addCustom');
    userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    userRequest.send(JSON.stringify({
      'product_name':document.getElementById("prod_name").value
      , 'type':document.getElementById("addType").value
      , 'life':document.getElementById("prod_life").value
      , 'quantity': document.getElementById("prod_qty").value}));

  }
}

function filterByType() {
  var x = document.getElementById("types").value.length ? "?type=" + document.getElementById("types").value : "";
  if (window.location.hostname === "localhost") {
    window.location.replace("http://localhost:5000/" + x);
  } else {
    window.location.replace("https://whatscookinggoodlooking.herokuapp.com/" + x);
  }
}

function generateRecipes() {
  const recipeID = "96ed8d10";
  const recipeKey = "8d864561b07870cc4021658590483b25";
  const getProducts = new XMLHttpRequest();
  getProducts.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var fridgeProducts = JSON.parse(this.response)[0].json_agg;
      if (fridgeProducts == null) {
        // if the user's fridge is empty, show the messaging telling them so
        document.getElementById("noIngredients").style.display = "block";
      } else {
        // if the user's fridge is not empty
        const getRecipes = new XMLHttpRequest();
        if (fridgeProducts.length > 1) {
        var foodItem1 = fridgeProducts[Math.floor(Math.random() * fridgeProducts.length)];
        var foodItem2 = fridgeProducts[Math.floor(Math.random() * fridgeProducts.length)];
        getRecipes.open('get', `https://api.edamam.com/search?q=${foodItem1}+${foodItem2}&app_id=${recipeID}&app_key=${recipeKey}`);
        } else if (fridgeProducts.length == 1) {
          var foodItem1 = fridgeProducts[0];
          getRecipes.open('get', `https://api.edamam.com/search?q=${foodItem1}&app_id=${recipeID}&app_key=${recipeKey}`);
        }
        getRecipes.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        getRecipes.send();
        getRecipes.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var recipes = [];
            JSON.parse(this.response).hits.forEach((hit) => recipes.push(hit.recipe));

            var foodItems = document.createElement("h2");
            if (fridgeProducts.length == 1) {
              foodItems.innerHTML = `With ${foodItem1} you can make:`;
            } else {
              foodItems.innerHTML = `With ${foodItem1} and ${foodItem2} you can make:`;
            }

            foodItems.classList.add("foodItemsLabel");
            document.getElementById("recipes").appendChild(foodItems);

            recipes.forEach((function(recipe) {
              var title = document.createElement("a");
              title.innerHTML = recipe.label;
              title.href = recipe.url;
              title.target = "_blank";
              title.classList.add("recipeLabel");
              document.getElementById("recipes").appendChild(title);

              var image = document.createElement("img");
              image.src = recipe.image;
              image.classList.add("recipeImage");
              document.getElementById("recipes").appendChild(image);
            }));
          }
        }
      }
    };
  }
  getProducts.open('post', '/getProducts');
  getProducts.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  getProducts.send();
}

function openForm(event) {
  document.getElementById(event.target.value).style.display = "block";
}

function closeForm(event) {
  document.getElementById(event.target.value).style.display = "none";
}
function searchError(){
   var s = document.forms["Search"]["searchParam"].value;
   if (s=="") {
    alert ("Please input a product name in the search box");
    return false;
   }
   else{
    return true;
   }

}

function editProfile() {
  alert(":)!");
}

function validate() {
  var a = document.forms["editProfile"]["name"].value;
  if (a == "") {
    alert("Can't be empty!");
    return false;
  } else {
    editProfile()
  }
  var b = document.forms["editProfile"]["email"].value;
  var c = document.forms["editProfile"]["postal_code"].value;
  var d = document.forms["editProfile"]["email_freq"].value;
}

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("fridge");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
