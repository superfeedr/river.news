function serialize(object, prefix) {
  var q = [];
  for(var k in object) {
    if (object.hasOwnProperty(k)) {
      var k = prefix ? prefix + "[" + k + "]" : k, v = object[k];
      q.push(typeof v == "object" ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return q.join("&");
}

module.exports = serialize;