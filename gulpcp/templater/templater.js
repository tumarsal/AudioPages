var path = require('path');
var fs = require('fs');
var ul = require('ul');
var glob = require('glob');

/**
 * Creates a new `Templator` instance.
 * @name Templator
 * @function
 * @param {Object} options An object containing the following fields:
 *
 *  - `templateFile` (String): Path to template file to use
 *  - `tag` (String): Keyword to use be used in HTML placeholder comments
 *  - `buildTag` (String): Keyword to use be used in HTML placeholder build comments (overrides --tag)
 *  - `defineTag` (String): Keyword to use be used in HTML placeholder define comments (overrides --tag)
 */

var Templator = function(options) {
  if (typeof options === 'string') {
    
    options = {
      
      htmlparts: glob.sync(options)
    };
  }

  // default tag
  options = ul.merge(options, {
    tag: 'build',
  });

  // default build tag and define tag
  options = ul.merge(options, {
    buildTag: options.tag,
    defineTag: options.tag,
  });
  var defineTag  = options.defineTag;
  var buildTag = options.buildTag;
  function getMatches(regex,text){
    var m;
    var matches = [];
    do {
      m = regex.exec(text);
      if (m) {
        matches.push(m);
      }
    } while (m);
    return matches;
  }
  function genRegex(name) {
    return new RegExp(
      '<!--\\s*' + defineTag + ':' + name + '\\s*-->' +
      '((.|[\\r\\n])+)' +
      '<!--\\s*\\/' + defineTag + ':' + name + '\\s*-->','g'
    );
  }
  this.options = options;
  options.opmap = {};
  var htmlparts = options.htmlparts;
  var startRegex = new RegExp('<!--\\s*' + buildTag + ':([^\\s]+)\\s*-->', 'g');
  for(var templateItem of htmlparts){
    var filePath = path.resolve(templateItem);
    var tempOps = fs.readFileSync(filePath).toString();
   
    var matches = getMatches(startRegex,tempOps);
    var findMatchesCount = 0
    var replaceTags = []
    var newOps = []
    for (var matche of  matches){
        var tagName = matche[1];
        var tagRegex = genRegex(tagName)
        var optionMatches = getMatches(tagRegex,tempOps)
        if(optionMatches.length>0){
          findMatchesCount++;
          var opsvalue = optionMatches[0][0]
          options.opmap[tagName] = opsvalue
          newOps.push(opsvalue)
        } else {
          replaceTags.push(matche[1])
        }
    }
    if(findMatchesCount==0){
      var filename = path.parse(filePath).name;
      options.opmap[filename] = tempOps
      newOps.push(tempOps)
    }
    if(replaceTags.length>0){
      for (var newOp of newOps){
        this.insetTags(newOp,replaceTags);
      }
    }
  }  
};

/**
 * Run the contents of an HTML file through the `Templator`
 * @name processFile
 * @function
 * @param {String} contentFile Path to HTML file to be processed
 * @return {String} The processed HTML
 */

Templator.prototype.processFile = function (contentFile) {
  return this.processContent(fs.readFileSync(contentFile).toString());
};

/**
 * Generate HTML from template file and content file
 * @name processContent
 * @function
 * @param {String} content HTML content to be used in template
 * @return {String} The processed HTML
 */
Templator.prototype.insetTags = function(content,tags){
  var buildTag = this.options.buildTag;
  var opmap = this.options.opmap;
  var result = content;
  for (var tag of tags){
    var find = opmap[tag];
    if(find){
      var tagRegex = new RegExp('<!--\\s*' + buildTag + ':'+tag+'\\s*-->', 'g');
      //console.log('replace '+ tag+ " find "+find)
      result=result.replace(tagRegex, find);
    }
  }
  return result;
}
Templator.prototype.processContent = function (content) {
  var buildTag = this.options.buildTag;
  var defineTag = this.options.defineTag;
  var regMark = new RegExp('<!--\\s*' + buildTag + ':([^\\s]+)\\s*-->', 'g');
  var opmap = this.options.opmap;
  res = content.replace(regMark, function (match, name) {
    var find = opmap[name];
    
   // console.log('insert '+ name+ " find" +find)
    return find ? find : match;
  });
  return res;
};

module.exports = Templator;