function GetUsers() {
  $.ajax({
    url: "/api/users",
    type: "GET",
    contentType: "application/json",
    success: function(users) {
      var rows = "";
      $.each(users, function(index, user) {
        rows += row(user);
      });
      $("table tbody").append(rows);
    }
  });
}
function GetUser(id) {
  $.ajax({
    url: "/api/users/" + id,
    type: "GET",
    contentType: "application/json",
    success: function(user) {
      var form = document.forms["userForm"];
      form.elements["id"].value = user.id;
      form.elements["name"].value = user.name;
      form.elements["age"].value = user.age;
    }
  });
}
function CreateUser(userName, userAge) {
  $.ajax({
    url: "api/users",
    contentType: "application/json",
    method: "POST",
    data: JSON.stringify({
      name: userName,
      age: userAge
    }),
    success: function(user) {
      reset();
      $("table tbody").append(row(user));
    }
  });
}
function EditUser(userId, userName, userAge) {
  $.ajax({
    url: "api/users",
    contentType: "application/json",
    method: "PUT",
    data: JSON.stringify({
      id: userId,
      name: userName,
      age: userAge
    }),
    success: function(user) {
      reset();
      $("tr[data-rowid='" + user.id + "']").replaceWith(row(user));
    }
  });
}

function reset() {
  var form = document.forms["userForm"];
  form.reset();
  form.elements["id"].value = 0;
}

function DeleteUser(id) {
  $.ajax({
    url: "api/users/" + id,
    contentType: "application/json",
    method: "DELETE",
    success: function(user) {
      console.log(user);
      $("tr[data-rowid='" + user.id + "']").remove();
    }
  });
}

var row = function(user) {
  return (
    "<tr data-rowid='" +
    user.id +
    "'><td>" +
    user.id +
    "</td>" +
    "<td>" +
    user.name +
    "</td> <td>" +
    user.age +
    "</td>" +
    "<td><a class='editLink' data-id='" +
    user.id +
    "'>Edit</a> | " +
    "<a class='removeLink' data-id='" +
    user.id +
    "'>Remove</a></td></tr>"
  );
};

$("#reset").click(function(e) {
  e.preventDefault();
  reset();
});

$("form").submit(function(e) {
  e.preventDefault();
  var id = this.elements["id"].value;
  var name = this.elements["name"].value;
  var age = this.elements["age"].value;
  if (id == 0) CreateUser(name, age);
  else EditUser(id, name, age);
});

$("body").on("click", ".editLink", function() {
  var id = $(this).data("id");
  GetUser(id);
});

$("body").on("click", ".removeLink", function() {
  var id = $(this).data("id");
  DeleteUser(id);
});

GetUsers();
