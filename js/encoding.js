const encode = {
  int_to_uint8: function (value) {
    let bytes = new Uint8Array(4);
    for (let i = 0; i < 4; i++) {
      bytes[i] = (value >> (i * 8)) & 0xff;
    }
    return bytes;
  },
  uint8_to_int: function (bytes) {
    let value = 0;
    for (let i = 0; i < 4; i++) {
      value += bytes[i] << (i * 8);
    }
    return value;
  },
  bytes_to_hex: function (bytes) {
    return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  },
  hex_to_bytes: function (text) {
    let byteLength = text.length >> 1;
    let bytes = new Uint8Array(byteLength);
    for (let i = 0; i < byteLength; i++) {
      bytes[i] = Number("0x" + text.substring(i * 2, i * 2 + 2));
    }
    return bytes;
  },
  base64Chars:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  picker: function (n) {
    return encode.base64Chars.substring(n, n + 1);
  },
  finder: function (x) {
    return x === "" ? -1 : encode.base64Chars.indexOf(x);
  },
  arrayBuffer_to_b64: function (arrayBuffer) {
    return encode.bytes_to_b64(new Uint8Array(arrayBuffer));
  },
  bytes_to_b64: function (bytes) {
    let text = "";
    let padding = bytes.length % 3;
    for (let i = 0; i < bytes.length; i += 3) {
      text += encode.picker((bytes[i] & 252) >> 2);
      text += encode.picker(
        ((bytes[i] & 3) << 4) + ((bytes[i + 1] & 240) >> 4),
      );
      text += encode.picker(
        ((bytes[i + 1] & 15) << 2) + ((bytes[i + 2] & 192) >> 6),
      );
      text += encode.picker(bytes[i + 2] & 63);
    }
    if (padding !== 0)
      text = text.substring(0, text.length - (1 + 2 - padding));
    return text;
  },
  b64_to_bytes: function (text) {
    text.replace("=", "");
    let bytes = new Uint8Array((3 * text.length) / 4);
    let byteEnum = 0;
    for (let i = 0; i < text.length; i += 4) {
      let values = [
        encode.finder(text.substring(i, i + 1)),
        encode.finder(text.substring(i + 1, i + 2)),
        encode.finder(text.substring(i + 2, i + 3)),
        encode.finder(text.substring(i + 3, i + 4)),
      ];
      bytes[byteEnum] = (values[0] << 2) + ((values[1] & 48) >> 4);
      bytes[byteEnum + 1] = ((values[1] & 15) << 4) + ((values[2] & 60) >> 2);
      bytes[byteEnum + 2] = ((values[2] & 3) << 6) + values[3];
      byteEnum += 3;
    }
    return bytes;
  },
};
