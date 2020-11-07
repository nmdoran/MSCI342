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
  userRequest.send(JSON.stringify({'product':document.getElementById("searchedproduct").value}));
}

function removeProduct() {
  console.log("Removing a product...")
  const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/removeProduct');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'product':document.getElementById("removeProduct").value, 'quantity': document.getElementById("quantity").value}));
}

/*function searchProduct() {
  console.log("searching a product...")
  const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/db');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'product':document.getElementById("addProduct").value}));
/*