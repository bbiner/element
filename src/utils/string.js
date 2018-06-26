export default {
  sprintf (str, obj) {
    if (obj.length < 1) {
      return str
    }
    var x
    for (x in obj) {
      str = str.replace(`{${x}}`, obj[x])
    }
    return str
  }
}
