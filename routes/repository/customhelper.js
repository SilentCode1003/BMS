var fs = require('fs');

exports.ReadJSONFile = function (filepath) {
    console.log(`Read JSON file: ${filepath}`);
    var data = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(data);
};

exports.GetFolderList = function(dir){
    console.log(`Content: ${dir}`);
    var data = fs.readdirSync(dir);
    return data;
};

exports.GetFiles = function(dir){
    console.log(`Content: ${dir}`);
    var data = fs.readdirSync(dir);
    return data;
};
