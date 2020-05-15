let compteur = -1;
let objAudio;
const lecteurDiv = document.getElementById("lecteur");
const lecteurAudio = document.getElementById("lecteurAudio");
const btnTry = document.getElementById("try");
const value = document.getElementById("valueToTry");
const result = document.getElementById("resultat");
btnTry.addEventListener("click", tryValue);
lecteurAudio.addEventListener("ended", lecturePlaylist);

function getAllPlaylists() {
  httpGet("/api/playlists/all")
    .then((response) => response.json())
    .then((response) => {
      var allPlaylists = response.playlists;
      objAudio = allPlaylists[0];
    })
    .then(() => {
      lecturePlaylist();
    });
}

function lecturePlaylist() {
  compteur++;
  if (compteur < objAudio.tracks.length){
    lecteurAudio.src = objAudio.tracks[compteur].preview_url;
    lecteurAudio.autoplay = "true";
   }  else {
    lecteurAudio.src = null;
    lecteurAudio.autoplay = "false";
    result.innerHTML = "La partie est finie!"
    }
 

}

function tryValue() {
  if (value.value === objAudio.tracks[compteur].name || value.value === objAudio.tracks[compteur].artist ) {
    result.innerHTML = "Bravo !!";
    lecturePlaylist();
  } else {
    result.innerHTML = "Nope...";
  }
}

getAllPlaylists();
//lecturePlaylist();

/******************************************************************************
 *                          Fetch and display users
 ******************************************************************************/

//displayUsers();

function displayUsers() {
  httpGet("/api/users/all")
    .then((response) => response.json())
    .then((response) => {
      var allUsers = response.users;
      // Empty the anchor
      var allUsersAnchor = document.getElementById("all-users-anchor");
      allUsersAnchor.innerHTML = "";
      // Append users to anchor
      allUsers.forEach((user) => {
        allUsersAnchor.innerHTML += getUserDisplayEle(user);
      });
    });
}

function getUserDisplayEle(user) {
  return `<div class="user-display-ele">

        <div class="normal-view">
            <div>Name: ${user.name}</div>
            <div>Email: ${user.email}</div>
            <button class="edit-user-btn" data-user-id="${user.id}">
                Edit
            </button>
            <button class="delete-user-btn" data-user-id="${user.id}">
                Delete
            </button>
        </div>
        
        <div class="edit-view">
            <div>
                Name: <input class="name-edit-input" value="${user.name}">
            </div>
            <div>
                Email: <input class="email-edit-input" value="${user.email}">
            </div>
            <button class="submit-edit-btn" data-user-id="${user.id}">
                Submit
            </button>
            <button class="cancel-edit-btn" data-user-id="${user.id}">
                Cancel
            </button>
        </div>
    </div>`;
}

/******************************************************************************
 *                        Add, Edit, and Delete Users
 ******************************************************************************/

document.addEventListener(
  "click",
  function (event) {
    event.preventDefault();
    var ele = event.target;
    if (ele.matches("#add-user-btn")) {
      addUser();
    } else if (ele.matches(".edit-user-btn")) {
      showEditView(ele.parentNode.parentNode);
    } else if (ele.matches(".cancel-edit-btn")) {
      cancelEdit(ele.parentNode.parentNode);
    } else if (ele.matches(".submit-edit-btn")) {
      submitEdit(ele);
    } else if (ele.matches(".delete-user-btn")) {
      deleteUser(ele);
    }
  },
  false
);

function addUser() {
  var nameInput = document.getElementById("name-input");
  var emailInput = document.getElementById("email-input");
  var data = {
    user: {
      name: nameInput.value,
      email: emailInput.value,
    },
  };
  httpPost("/api/users/add", data).then(() => {
    displayUsers();
  });
}

function showEditView(userEle) {
  var normalView = userEle.getElementsByClassName("normal-view")[0];
  var editView = userEle.getElementsByClassName("edit-view")[0];
  normalView.style.display = "none";
  editView.style.display = "block";
}

function cancelEdit(userEle) {
  var normalView = userEle.getElementsByClassName("normal-view")[0];
  var editView = userEle.getElementsByClassName("edit-view")[0];
  normalView.style.display = "block";
  editView.style.display = "none";
}

function submitEdit(ele) {
  var userEle = ele.parentNode.parentNode;
  var nameInput = userEle.getElementsByClassName("name-edit-input")[0];
  var emailInput = userEle.getElementsByClassName("email-edit-input")[0];
  var id = ele.getAttribute("data-user-id");
  var data = {
    user: {
      name: nameInput.value,
      email: emailInput.value,
      id: id,
    },
  };
  httpPut("/api/users/update", data).then(() => {
    displayUsers();
  });
}

function deleteUser(ele) {
  var id = ele.getAttribute("data-user-id");
  httpDelete("/api/users/delete/" + id).then(() => {
    displayUsers();
  });
}

function httpGet(path) {
  return fetch(path, getOptions("GET"));
}

function httpPost(path, data) {
  return fetch(path, getOptions("POST", data));
}

function httpPut(path, data) {
  return fetch(path, getOptions("PUT", data));
}

function httpDelete(path) {
  return fetch(path, getOptions("DELETE"));
}

function getOptions(verb, data) {
  var options = {
    dataType: "json",
    method: verb,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  return options;
}
