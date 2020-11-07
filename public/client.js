console.log('Script file loaded successfully');

function init() {
  gapi.load('auth2', function() {
    /* Ready. Make a call to gapi.auth2.init or some other API */
    gapi.auth2.init({ client_id: "428407383068-nec4si48ja9r4pahl3ohp4rtq3cc8v7m.apps.googleusercontent.com" }).then(function(res) {
      console.log(res)
      console.log("GoogleAuth:", GoogleAuth)
      console.log("About to check if signed in:")
      if (GoogleAuth.isSignedIn.get()) {
        var profile = auth2.currentUser.get().getBasicProfile();
        console.log('ID: ' + profile.getId());
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
      }
      if (GoogleAuth) {
        console.log(GoogleAuth.currentUser.get())
      }
    })
    
  });
}


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

function removeProduct() {
  console.log("Removing a product...")
  const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/removeProduct');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'product':document.getElementById("removeProduct").value, 'quantity': document.getElementById("quantity").value}));
}