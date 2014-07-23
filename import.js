#!/usr/bin/env node

var program = require('commander');
var Hackpad = require('hackpad');
var path = require('path');
var fs = require('fs');
var async = require('async');

var FORMATS = {
  ".html": "text/html",
  ".md": "text/x-web-markdown",
  ".txt": "text/plain"
};

program
  .version('0.0.1')
  .option('-i, --clientId <clientId>', 'your hackpad api clientId')
  .option('-t, --secret <secret>', 'your hackpad api secret')
  .option('-p, --path <path>', 'specify the directory path where files to be imported are located. Defaults to current directory', __dirname)
  .option('-s, --site <site>', '(optional) specify a private hackpad site (i.e. mycompany.hackpad.com)', 'hackpad.com')
  .option('-d, --dryrun', '(optional) will list files that would be imported, but not actually import them')
  .parse(process.argv);

if ( program.clientId == null) {
  console.log('You must provide a clientId. Specify using -i');
  process.exit();
}
if ( program.secret == null ) {
  console.log('You must provide a secret. Specify using -s');
  process.exit();
}

var client = new Hackpad(program.clientId, program.secret, {site:program.site}); 
var dir = program.path;

var imported = 0;
walkPath( dir, function(err, files) {
  if(err) handleError(err);
  console.info('Found %s files', files.length);
  async.each(files, createPad, function (err) {
    if(err) handleError(err);
    console.log('Imported %s files', imported);
    process.exit();
  });
});

function handleError(err) {
  console.log(err);
  process.exit();
}

function createPad(file, cb) {
  // determine format from file extension
  var ext = path.extname(file);
  var format = FORMATS[ext];
  
  // skip invalid file types
  if (format == null) {
    console.info('Skipping file with unknown format %s', file);
    return cb();
  }
  fs.readFile(file, {encoding: 'utf8', flag: 'r'}, function (err, content) {
    if (err) cb(err);
    imported++;
    if (program.dryrun) {
      console.info('Would import file %s to hackpad %s', file);
      return cb();
    } else {
      client.create(content, format, function(err, res) {
        if(err) handleError(err);
        console.info('Imported file %s to hackpad %s', file, 'http://' + program.site +'/' + res.padId);
        return cb(null, res.padId);
      });      
    }
  });
}

function walkPath(dir, done) {
  var files = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, files);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walkPath(file, function(err, res) {
            files = files.concat(res);
            next();
          });
        } else {
          files.push(file);
          next();
        }
      });
    })();
  });
}