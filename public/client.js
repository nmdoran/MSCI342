console.log('Script file loaded successfully');

function addRow() {
  console.log("Adding a row...")
  const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/addRow');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'id':document.getElementById("id").value, 'name': document.getElementById("name").value}));
}

function deleteRow() {
  console.log("Deleting a row...")
  const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/deleteRow');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'id':document.getElementById("id").value, 'name': document.getElementById("name").value}));
}

function addProduct() {
  console.log("Adding a product...")
  const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/addProduct');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'product':document.getElementById("addProduct").value, 'quantity': document.getElementById("quantity").value}));
}

function addProductFromSearch() {
  console.log("Adding a product...")
  const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/addProduct');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'product':document.getElementById("searchedproduct").value, 'quantity': 1}));
}

function removeProduct() {
  console.log("Removing a product...")
  const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/removeProduct');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'product':document.getElementById("removeProduct").value, 'quantity': document.getElementById("quantity").value}));
}


function sortbyExpiry() {
  var x = document.getElementById("expirysort").value;
  if (window.location.hostname === "localhost") {
    window.location.replace("http://localhost:5000/?expirysort="+x);
  } else {
    window.location.replace("https://whatscookinggoodlooking.herokuapp.com/?expirysort="+x);
  }
}

function editQuantity() {
  console.log("Editing quantity...")
  const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/editQuantity');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'product':document.getElementById("editQuantity").value, 'quantity': document.getElementById("quantity2").value}));
}
  
function editExpiry() {
  console.log("Editing expiry date...")
  const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/editExpiry');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'product':document.getElementById("editExpiry").value, 'expirydate': document.getElementById("expirydate").value}));
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

function filterbytype() {
  var x = document.getElementById("Types").value;
  if (window.location.hostname === "localhost") {
    window.location.replace("http://localhost:5000/?type="+x);
  } else {
    window.location.replace("https://whatscookinggoodlooking.herokuapp.com/?type="+x);
  }
}

