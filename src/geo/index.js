
let data = require('./data.json');
let fs = require('fs')

console.log(data.features.length)

let list = data.features.filter(function(elt) {
  return ["hotel", "museum"].some(function(item) { return elt.properties.tourism === item }) && elt.properties.name
})


fs.writeFileSync('data_clean.json', JSON.stringify(list));

console.log(list.length)