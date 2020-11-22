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
  userRequest.send(JSON.stringify({'product':document.getElementById("searchedproduct").value, 'quantity' : document.getElementById("quantity").value}));
  var q = document.getElementById("quantity").value;
  if (q==""){
    alert ("Please specify a quantity");
    return false;
  }
  if (q<=0){
    alert ("Invalid negative quantity");
    return false
  }
 
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
  console.log("Adding a custom product...")
  const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/addCustom');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({
    'product_name':document.getElementById("prod_name").value
    , 'type':document.getElementById("addType").value
    , 'life':document.getElementById("prod_life").value
    , 'quantity': document.getElementById("prod_qty").value}));
}

function filterbytype() {
  var x = document.getElementById("Types").value;
  if (window.location.hostname === "localhost") {
    window.location.replace("http://localhost:5000/?type="+x);
  } else {
    window.location.replace("https://whatscookinggoodlooking.herokuapp.com/?type="+x);
  }
}

function searchError(){
   var s = document.forms["Search"]["searchParam"].value;
   // if (s!=prod_name){
   //  alert("not found");
   //  return false
   // }
   if (s=="") {
    alert ("Please input a product name in the search box");
    return false;
   }
   if(isNaN(s)){
    return addProductFromSearch()
   }
   else{
    alert ("Please search by product name only")
    return false

   }
}



