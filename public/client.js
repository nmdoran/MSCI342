console.log('Script file loaded successfully');

function addRow() {
  console.log("Adding a row...")
  const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/addRow');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'id':document.getElementById("id").value, 'name': document.getElementById("name").value}));

  /* $.ajax({
    type: "POST",
    url: '/addRow',
    dataType: "json",
    success: function(res) {
        console.log("Success!", res)
        var res_data = JSON.parse(res);
        console.log(res_data);
    },
    error: function(res) {
      console.log("Fail!", res)
    }
  }); */

  /* $.ajax({
    type: "GET",
    url: '/users',
    dataType: "json",
    success: function(res) {
        console.log("Success!")
        var res_data = JSON.parse(res);
        console.log(res_data);
    },
    error: function(res) {
      console.log("Fail!", res)
    }
  }); */
}

function deleteRow() {
  console.log("Deleting a row...")
  const userRequest = new XMLHttpRequest();
  userRequest.open('post', '/deleteRow');
  userRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  userRequest.send(JSON.stringify({'id':document.getElementById("id").value, 'name': document.getElementById("name").value}));
}