async function generate_derivation_key() {
  return await window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-384" },
    true,
    ["deriveKey", "deriveBits"],
  );
}

async function derive_symmetric_key(privateKey, publicKey) {
  return await window.crypto.subtle.deriveKey(
    { name: "ECDH", namedCurve: "P-384", public: publicKey },
    privateKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}

async function derive_new_key(keydf, nonce, salt_xor) {
  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: mksalt(20000, nonce, salt_xor),
      hash: "SHA-256",
      iterations: 10000,
    },
    keydf,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}

async function new_pbkdf(sharedKey, nonce, salt_xor, HMACKey) {
  let keydata = new Uint8Array(
    await window.crypto.subtle.exportKey("raw", sharedKey),
  );
  let salt = mksalt(20980, nonce, salt_xor);
  for (let i = 0; i < 32; i++) keydata[i] = salt[i];

  let newHBK = keydata;
  if (typeof HMACKey !== "undefined") {
    newHBK = new Uint8Array(
      await window.crypto.subtle.sign({ name: "HMAC" }, HMACKey, keydata),
    );
  }
  return await window.crypto.subtle.importKey(
    "raw",
    newHBK,
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"],
  );
}

async function get_user_id(publicKey) {
  let digest = new Uint8Array(
    await window.crypto.subtle.digest(
      { name: "SHA-256" },
      encode.b64_to_bytes(publicKey),
    ),
  ).slice(0, 12);
  return encode.bytes_to_b64(digest);
}
