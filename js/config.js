// Handle hostname configuration
let hostname = localStorage.getItem("hostname") || "danielharvey.uk:8080";

if (!localStorage.getItem("hostname")) {
  setTimeout(() => {
    document.getElementById("decryptOutput").innerText =
      "No hostname set. (Advanced options > Hostname)";
  }, 10);
}

document.getElementById("hostnameBtn").onclick = () => {
  let newHostname = document.getElementById("hostname").value;
  if (newHostname) {
    hostname = newHostname;
    localStorage.setItem("hostname", newHostname);
    document.getElementById("hostname").style.backgroundColor = "#8f7";
  }
};
