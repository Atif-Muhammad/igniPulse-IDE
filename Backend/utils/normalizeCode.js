exports.normalizeCode= function(code) {
  return code.replace(/\s+/g, "");
    // .split("\n")
    // .map(line => line.trim())   
    // .filter(line => line !== "") 
    // .join("\n")               
    // .replace(/\s+/g, " ");   
}