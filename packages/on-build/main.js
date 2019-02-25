'use strict';
var path = require('path');
var fs = require('fs');

/**
 * 
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
function findSync(startPath) {
  var result = [];
  function finder(_path) {
    var files = fs.readdirSync(_path);
    files.forEach((val, index) => {
      var fPath = path.join(_path, val);
      var stats = fs.statSync(fPath);
      if (stats.isDirectory()) finder(fPath);
      if (stats.isFile()) result.push(fPath);
    });

  }
  finder(startPath);
  return result;
}

function onBeforeBuildFinish(options, callback) {
  var indexHtmlPath = path.join(options.dest, 'index.html');
  var html = fs.readFileSync(indexHtmlPath, 'utf8');

  var cssName = html.substr(html.indexOf('style-mobile'), ('style-mobile.06896.css').length);
  var cssPath = path.join(options.dest, cssName);
  var css = fs.readFileSync(cssPath, 'utf8');

  var loadingPngPath = findSync(options.dest + '/res/raw-assets/f8/')[0].replace(/\\/g, '\/');
  loadingPngPath = './' + loadingPngPath.substr(loadingPngPath.indexOf('res'));

  css = css.replace('./test.png', loadingPngPath);
  fs.writeFileSync(cssPath, css);

  callback();
}

module.exports = {
  load() {
    Editor.Builder.on('build-finished', onBeforeBuildFinish);
  },

  unload() {
    Editor.Builder.removeListener('build-finished', onBeforeBuildFinish);
  }
};