// WebSocket Handling

let ws;
let clientsOnline = {};

function register_key() {
  ws = new WebSocket(
    `ws://${hostname}/register?key=${localStorage.derivKeyPub}`,
  );
  ws.onmessage = (e) => {
    clientsOnline = JSON.parse(e.data);
    display_users_online(clientsOnline);
  };
}

function get_online_users() {
  ws = new WebSocket(
    `ws://${hostname}/register?n=${Object.keys(clientsOnline).length}`,
  );
  ws.onmessage = (e) => {
    clientsOnline = JSON.parse(e.data);
    display_users_online(clientsOnline);
  };
}

function display_users_online(users) {
  document.getElementById("users").innerHTML = "";
  let myId = get_user_id(localStorage.derivKeyPub);
  Object.keys(clientsOnline).forEach((element) => {
    if (element !== myId) {
      document.getElementById("users").innerHTML +=
        `<a href="#user=${element}" id="${element}" onclick="document.getElementById('outsidePublicKey').value='${element}'">${element}</a> `;
    }
  });
}
