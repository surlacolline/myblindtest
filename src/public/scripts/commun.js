const popupDiv = document.getElementById('popup1');

function httpGet(path) {
  return fetch(path, getOptions('GET'));
}

function httpPost(path, data) {
  return fetch(path, getOptions('POST', data));
}

function httpPut(path, data) {
  return fetch(path, getOptions('PUT', data));
}

function httpDelete(path) {
  return fetch(path, getOptions('DELETE'));
}

function getOptions(verb, data) {
  var options = {
    dataType: 'json',
    method: verb,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  return options;
}

async function loadPopupDiv() {
  const response = await fetch('../../playlist/popup');
  const html = await response.text();
  popupDiv.innerHTML = html;
}
function getCookie(name) {
  if (document.cookie.length == 0) return null;

  var regSepCookie = new RegExp('(; )', 'g');
  var cookies = document.cookie.split(regSepCookie);

  for (var i = 0; i < cookies.length; i++) {
    var regInfo = new RegExp('=', 'g');
    var infos = cookies[i].split(regInfo);
    if (infos[0] == name) {
      return unescape(infos[1]);
    }
  }
  return null;
}
loadPopupDiv().catch((error) => {
  console.log('error!');
  console.error(error);
});
