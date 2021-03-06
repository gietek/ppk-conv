/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/
export function json2xml(o, tab) {
  var toXml = function (v, name, ind) {
      var xml = "";
      if (v instanceof Array) {
        for (var i = 0, n = v.length; i < n; i++)
          xml += ind + toXml(v[i], name, ind + "\t") + "\n";
      } else if (typeof v == "object") {
        var hasChild = false;
        xml += ind + "<" + name;
        for (var m in v) {
          if (m.charAt(0) == "@") {
            if (m == "@attributes" && typeof v[m] === "object") {
              const attrs = v[m];
              Object.keys(attrs).forEach((k) => {
                xml += " " + k + '="' + attrs[k].toString() + '"';
              });
            } else {
              xml += " " + m.substr(1) + '="' + v[m].toString() + '"';
            }
          } else hasChild = true;
        }
        xml += hasChild ? ">" : "/>";
        if (hasChild) {
          for (var m in v) {
            if (m == "#text" && v[m] !== undefined) xml += v[m];
            else if (m == "#cdata") xml += "<![CDATA[" + v[m] + "]]>";
            else if (m.charAt(0) != "@") xml += toXml(v[m], m, ind + "\t");
          }
          xml +=
            (xml.charAt(xml.length - 1) == "\n" ? ind : "") +
            "</" +
            name +
            ">\n";
        }
      } else if (v) {
        xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">\n";
      }
      return xml;
    },
    xml = "";

  for (var m in o) xml += toXml(o[m], m, "");
  xml = xml.replace(/\n\n/g, "\n");
  return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}
