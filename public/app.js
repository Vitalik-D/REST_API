function GetUsers() {
  $.ajax({
    url: "/api/users",
    type: "GET",
    contentType: "application/json",
    success: function (users) {
      let rows = "";
      $.each(users, function (index, user) {

        rows += row(user);
      })
      $("table tbody").append(rows);
    }
  });
}

function GetUser(id) {
  $.ajax({
    url: "/api/users/"+id,
    type: "GET",
    contentType: "application/json",
    success: function (user) {
      let form = document.forms["userForm"];
      form.elements["id"].value = user._id;
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
    success: function (user) {
      reset();
      $("table tbody").append(row(user));
    }
  })
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
    success: function (user) {
      reset();
      console.log(user);
      $("tr[data-rowid='" + user._id + "']").replaceWith(row(user));
    }
  })
}


function reset() {
  let form = document.forms["userForm"];
  form.reset();
  form.elements["id"].value = 0;
}


function DeleteUser(id) {
  $.ajax({
    url: "api/users/"+id,
    contentType: "application/json",
    method: "DELETE",
    success: function (user) {
      console.log(user);
      $("tr[data-rowid='" + user._id + "']").remove();
    }
  })
}

let row = function (user) {
  return "<tr data-rowid='" + user._id + "'><td>" + user._id + "</td>" +
      "<td>" + user.name + "</td> <td>" + user.age + "</td>" +
      "<td><a class='editLink' data-id='" + user._id + "'>Изменить</a> | " +
      "<a class='removeLink' data-id='" + user._id + "'>Удалить</a></td></tr>";
}

$("#reset").click(function (e) {

  e.preventDefault();
  reset();
});


$("form").submit(function (e) {
  e.preventDefault();
  let id = this.elements["id"].value;
  let name = this.elements["name"].value;
  let age = this.elements["age"].value;
  if (id == 0)
    CreateUser(name, age);
  else
    EditUser(id, name, age);
});


$("body").on("click", ".editLink", function () {
  let id = $(this).data("id");
  GetUser(id);
});

$("body").on("click", ".removeLink", function () {
  let id = $(this).data("id");
  DeleteUser(id);
});


GetUsers();