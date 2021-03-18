let string2Byte = (str) => {
  // var bytes = new Array();
  var bytes = [];
  var len, c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  return bytes;
};

let bytes2StrHex = (arrBytes) => {
  var str = "";
  for (var i = 0; i < arrBytes.length; i++) {
    var tmp;
    var num = arrBytes[i];
    if (num < 0) {
      //此处填坑，当byte因为符合位导致数值为负时候，需要对数据进行处理
      tmp = (255 + num + 1).toString(16);
    } else {
      tmp = num.toString(16);
    }
    if (tmp.length === 1) {
      tmp = "0" + tmp;
    }
    if (i > 0) {
      str += tmp;
    } else {
      str += tmp;
    }
  }
  return str;
};

let getViolasTyArgs = (_module, _name, _address) => {
  let address = _address ? _address : "00000000000000000000000000000001";
  let prefix = "07";
  let suffix = "00";
  let _module_length = _module.length;
  if (_module_length < 10) {
    _module_length = "0" + _module_length;
  }
  let _module_hex = bytes2StrHex(string2Byte(_module));
  let name_length = _name.length;
  if (name_length < 10) {
    name_length = "0" + name_length;
  }
  let _name_hex = bytes2StrHex(string2Byte(_name));
  let result =
    prefix +
    address +
    _module_length +
    _module_hex +
    name_length +
    _name_hex +
    suffix;
  return result;
};

export { string2Byte, bytes2StrHex, getViolasTyArgs };
