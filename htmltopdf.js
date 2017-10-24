#!/usr/bin/env node

var args = process.argv;
var url = args[2];
var file = args[3];

if(url == undefined || file == undefined){
	return console.log('args url file required');
}

var fs = require('fs');
var pdf = require('html-pdf');
var request = require('request');
var charset = require('charset')
    ,jschardet = require('jschardet')
    ,Iconv = require('iconv').Iconv;
var options = { format: 'A4' };

request.get({
    uri: url, encoding: 'binary'
  }, function (error, res, html) {

  var enc = charset(res.headers, html) || jschardet.detect(html).encoding.toLowerCase();
  
  if(enc !== 'utf8') {
    var iconv = new Iconv(enc, 'UTF-8//TRANSLIT//IGNORE');
    html = iconv.convert(new Buffer(html, 'binary')).toString('utf8');
  }

	pdf.create(html, options).toFile(file, function(err, res){
		console.log(res);
	});
});


