const path = require('path');

const homeConfig = {
    title: 'Hugh\'s Blog',
    keywords: 'Blog, Hugh Shen, hughshen, Linux, PHP, JavaScript, HTML, JS, CSS, Yii, WordPress',
    description: 'But he has never bought a lottery ticket.',
    showItems: 10,
    showClass: 'show',
    style: path.resolve(__dirname, 'less/home.less'),
    getHead: function() {
        return `<title>${this.title}</title>
<meta name="keywords" content="${this.keywords}">
<meta name="description" content="${this.description}">`;
    },
    getBody: function() {
        return `<noscript>
<style>
#list li { display: flex; flex-direction: row-reverse; align-items: center; justify-content: space-between; }
#page { display: none; }
@media (max-width: 480px) {
    #list li { flex-direction: column; justify-content: center; align-items: flex-start; }
}
</style>
</noscript>
<script>
var items = document.querySelectorAll('#list li'),
show = ${this.showItems},
pages = Math.ceil(items.length / show);
var pagination = {
index: 1,
range: 1,
data: [],
allText: 'A',
activeClass: 'active',
wrap: document.querySelector('#page'),
init: function() {
    this.wrap.innerHTML = '';
    this.data = [];
    for (var p = 1; p <= pages; p++) {
        if (p == 1) {
            this.data.push(p);
            if (this.index - 1 > this.range + 1) this.data.push('...');
        } else if (p == pages) {
            if (pages - this.index > this.range + 1) this.data.push('...');
            this.data.push(p);
            this.data.push(this.allText);
        } else {
            if (Math.abs(this.index - p) <= this.range) this.data.push(p);
        }
    }
    this.render();
},
render: function() {
    for (var i = 0; i < this.data.length; i++) {
        this.wrap.appendChild(this.tag(this.data[i]));
    }
},
goto: function() {
    var startKey = (this.index - 1) * show;
    var endKey = startKey + show;
    for (var i = 0; i < items.length; i++) {
        if (i >= startKey && i < endKey) {
            items[i].className = '${this.showClass}';
        } else {
            items[i].className = '';
        }
    }
},
all: function() {
    for (var i = 0; i < items.length; i++) {
        items[i].className = '${this.showClass}';
    }
    this.wrap.outerHTML = '';
},
tag: function(text) {
    var tag = document.createElement('li');
    if (parseInt(text) > 0 || text == this.allText) {
        var pagination = this;
        var index = parseInt(text);
        var a = document.createElement('a');
        a.href = 'javascript:;';
        a.innerHTML = text;
        if (text == this.allText) {
            a.addEventListener('click', function() {
                pagination.all();
            });
        } else {
            if (this.index == index) {
                tag.className = this.activeClass;
            } else {
                a.addEventListener('click', function() {
                    pagination.index = index;
                    pagination.goto();
                    pagination.init();
                });
            }
        }
        tag.appendChild(a);
    } else {
        tag.innerHTML = text;
    }
    return tag;
}
};
pagination.init();
</script>`;
    },
    getContent: function() {
        return `<ul id="page"></ul>`;
    },
}

const postConfig = {
    style: path.resolve(__dirname, 'less/post.less'),
    getHead: function() {
        return '';
    },
    getBody: function() {
        return '';
    },
    getContent: function() {
        return '';
    },
    getMetaTags: function(text) {
        let tags = '';
        let match = text.match(/<!--\s*(\w+):\s*(.*)\s*-->/ig);
        if (match.length) {
            match.map(val => {
                let meta = val.match(/<!--\s*(\w+):\s*(.*)\s*-->/i);
                if (typeof meta[1] !== 'undefined' && typeof meta[2] !== 'undefined') {
                    meta[1] = meta[1].trim();
                    meta[2] = meta[2].trim();
                    if (meta[1] == 'title') {
                        tags += `<title>${meta[2]} | ${homeConfig.title}</title>`;
                    } else {
                        tags += `<meta name="${meta[1]}" content="${meta[2]}">`;
                    }
                }
            });
        }
        return tags;
    },
    getTitle: function(text) {
        let title = '';
        let match = text.match(/<!--\s*title\s*:\s*(.*)\s*-->/i);
        if (typeof match[1] !== undefined) {
            title = match[1].trim();
        }
        return title;
    }
}

module.exports = {
    folder: {
        mdPath: path.resolve(__dirname, 'posts'),
        assetsLess: path.resolve(__dirname, 'less'),
        static: 'static',
        staticPost: 'post',
    },
    sitemap: true,
    siteUrl: 'https://imhugh.com',
    homeConfig: homeConfig,
    postConfig: postConfig,
    beforeHead: '',
    beforeBody: '',
    renderContent: '',
    setBeforeHead: function(text) {
        this.beforeHead += text;
    },
    setBeforeBody: function(text) {
        this.beforeBody += text;
    },
    setRenderContent: function(text) {
        this.renderContent += text;
    },
    renderClear: function() {
        this.beforeHead = '';
        this.beforeBody = '';
        this.renderContent = '';
    },
    render: function() {
        return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">${this.beforeHead}
</head>
<body>
<div id="content">
    <ul id="nav">
        <li><a href="/">Home</a></li>
        <li><a href="/tool/">Tools</a></li>
        <li><a href="https://github.com/hughshen" target="_blank">GitHub</a></li>
    </ul>${this.renderContent}
</div>
<footer>
    Copyright &copy; 2017 Hugh Shen, theme inspired by <a href="https://2b.dog/" target="_blank">Dawn's Blog</a>
</footer>${this.beforeBody}
</body>
</html>`;
    }
}
