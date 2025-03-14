// UI Handling

document.getElementById("lightMode").onclick = () => {
  document.body.style.backgroundColor = "#fff";
  document.body.style.color = "#000";
  localStorage.setItem("darkMode", "false");
};

document.getElementById("darkMode").onclick = () => {
  document.body.style.backgroundColor = "#203";
  document.body.style.color = "#edf";
  localStorage.setItem("darkMode", "true");
};

document.getElementById("generate").onclick = async () => {
  if (
    !confirm(
      "Are you sure you want to generate a new keypair?\n\nThis will overwrite your current keypair.",
    )
  )
    return;

  let passphrase = prompt("Password:");
  let uwkdf = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  let passwd = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: mksalt(10000, 9203, 8008135),
      iterations: 1000,
      hash: "SHA-256",
    },
    uwkdf,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );

  let derivKey = await generate_derivation_key();
  let exportedDerivKey = new Uint8Array(
    await window.crypto.subtle.exportKey("pkcs8", derivKey.privateKey),
  );
  let iv = window.crypto.getRandomValues(new Uint8Array(16));

  localStorage.setItem("derivIV", encode.bytes_to_b64(iv));
  localStorage.setItem(
    "derivKey",
    encode.bytes_to_b64(
      await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        passwd,
        exportedDerivKey,
      ),
    ),
  );
  localStorage.setItem(
    "derivKeyPub",
    encode.bytes_to_b64(
      await window.crypto.subtle.exportKey("spki", derivKey.publicKey),
    ),
  );

  let myId = await get_user_id(localStorage.derivKeyPub);
  document.getElementById("keys").innerText =
    `${localStorage.derivKeyPub}\n${myId}`;
  register_key();
};
