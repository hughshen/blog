var fs = require('fs');
var postsDir = './posts';
var postsDataFile = './data.json';
var posts = fs.readdirSync(postsDir);

// write data.json
fs.writeFile(postsDataFile, JSON.stringify(posts.reverse()), function(err) {
	if (err) throw err;
	console.log('ok');
});