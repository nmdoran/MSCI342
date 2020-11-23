console.log('Script file loaded successfully');

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
  console.log(document.getElementById("editQuantity").value)
  console.log(document.getElementById("editExpiryDate").value)

  const userRequest = new XMLHttpRequest();
  userRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      location.reload();
    }
  };
  userRequest.open('post', '/editFridgeItem');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'product': event.target.value, 'quantity': document.getElementById("editQuantity").value, 'expirydate': document.getElementById("editExpiryDate").value}));
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

function filterByType() {
  var x = document.getElementById("types").value.length ? "?type=" + document.getElementById("types").value : "";
  if (window.location.hostname === "localhost") {
    window.location.replace("http://localhost:5000/" + x);
  } else {
    window.location.replace("https://whatscookinggoodlooking.herokuapp.com/" + x);
  }
}

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}
