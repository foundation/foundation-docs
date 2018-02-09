var format     = require('string-template');
var handlebars = require('handlebars');
var hljs       = require('highlight.js');

handlebars.registerHelper('hasContent', function (obj) {
  if (typeof obj !== 'object') return false;

  var isFilled = false;
  Object.keys(obj).forEach(function (k) {
    if (obj[k] !== null && obj[k] !== undefined && !(obj[k].access === 'private' || obj[k].alias))
      isFilled = true;
  });
  return isFilled;
});
