var cc = require('./ConsoleConstants');
var config = require('./config.json');
var dom = require('xmldom').DOMParser;
var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var util = require('util');
var xpath = require('xpath');
var execFile = Promise.promisify(require('child_process').execFile);

var removeEmptyElems = function(string_arr){
  var ret = [];
  string_arr.forEach(elem => {
    if(elem != ''){
      ret.push(elem);
    }
  });

  return ret;
}

var generateColumnHeader = function(){
  var ret = '[Column] ';
  for(var i = 1; i <= 16; i++){
    if(i.toString().length === 1){
      ret += cc.bg_magenta + '0' + i.toString() + cc.reset + ' ';
    }
    else{
      ret += cc.bg_magenta + i.toString() + cc.reset + ' ';
    }
  }

  ret += '\n';

  return ret;
};

var generateLineHeader = function(lineNum){
  var pattern = '[Ln:' + cc.bg_magenta + '%s' + cc.reset + '] ';
  var strLineNum = '';
  if(lineNum.toString().length === 1){
    strLineNum = '00' + lineNum.toString();
  }
  else if(lineNum.toString().length === 2){
    strLineNum = '0' + lineNum.toString();
  }
  else{
    strLineNum = lineNum.toString();
  }

  return util.format(pattern, strLineNum);
};

var formatHexStringArray = function(string_arr, mismatches){
  var ret = generateColumnHeader();
  var line = 1;
  for(var i = 0; i < string_arr.length; i++){
    if(i % 16 == 0){
      if(i !== 0){
        ret += '\n';
      }
      ret += generateLineHeader(line++);
    }

    if(mismatches.includes(i)){
      ret += cc.bg_red + string_arr[i] + cc.reset + ' ';
    }
    else{
      ret += string_arr[i] + ' ';
    }
  }

  return ret;
};

var parseMismatchData = function(mismatch_index_arr){
  var ret = '';
  mismatch_index_arr.forEach(idx => {
    var line = Math.floor(idx / 16 + 1);
    var column = idx % 16 + 1;
    ret += util.format('Line: %d, Column: %d\n', line, column);
  });

  return ret;
};

execFile(path.join(config.check_xml_cwd, config.check_xml_exe), [ config.xml_file ], { cwd: config.check_xml_cwd })
.then((res) => {
  if(res.startsWith('Error')){
      console.log(cc.fg_red + res + cc.reset);
      return;
  }
  console.log(cc.fg_green + res + cc.reset);

  var xml_string = '<root>' + fs.readFileSync(config.xml_file).toString() + '</root>';
  var xmlDoc = new dom().parseFromString(xml_string);
  var l_nodes = xpath.select('//*[count(*)=0]', xmlDoc.childNodes[0]);
  var res = '';
  var arr = [];
  l_nodes.forEach(l_node => {
    var partArr = l_node.textContent.split(/\s+|\t|\r|\n/g);
    if(l_node.localName === 'BIT'){
      console.log(cc.fg_yellow + cc.bright + 'Warning: contains BIT element, and please check it manually' + cc.reset);
    }
    partArr.forEach(item => {
      if(item != ''){
        arr.push(item);
      }
    });
    var part = partArr.join(' ');
    res += part;
  });

  var hex_string = fs.readFileSync('./data/hex_data.txt').toString();
  var expected_arr = removeEmptyElems(hex_string.split(/\s+|\t|\r|\n/g));

  if(arr.length !== expected_arr.length){
    console.log('They have different lengths.');
  }

  var mismatches = [];
  for(var i = 0; i < Math.min(arr.length, expected_arr.length); i++){
    if(arr[i] !== expected_arr[i]){
      mismatches.push(i);
    }
  }

  console.log(cc.fg_cyan + 'From: XML string:' + cc.reset);
  console.log(formatHexStringArray(arr, mismatches) + '\n');
  console.log(cc.fg_cyan + 'From: Hex string:' + cc.reset);
  console.log(formatHexStringArray(expected_arr, mismatches) + '\n');

  var finalRes = parseMismatchData(mismatches);
  console.log(cc.fg_cyan + 'DIFF Results:' + cc.reset);
  if(finalRes === ''){
    console.log(cc.fg_green + 'no error is found' + cc.reset)
  }
  else{
    console.log(cc.fg_red + finalRes + cc.reset);
  }
});