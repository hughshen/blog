const showItems = 10;
const metaComment = '<!-- meta -->';
const styleComment = '<!-- style -->';
const contentComment = '<!-- content -->';

const config = {
    title: 'Hugh\'s Blog',
    keywords: 'Blog, Hugh Shen, hughshen, Linux, PHP, JavaScript, HTML, JS, CSS, Yii, WordPress',
    description: 'But he has never bought a lottery ticket.',
    postsDir: './app/posts',
    styleFile: './app/style.less',
    staticDir: './static',
    staticPostDir: 'post',
    showItems: showItems,
    sitemap: true,
    siteUrl: 'https://imhugh.com',
    metaComment: metaComment,
    styleComment: styleComment,
    contentComment: contentComment,
    layout: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
${metaComment}
${styleComment}
<noscript>
<style>
#list li { display: block; }
#page { display: none; }
</style>
</noscript>
</head>
<body>
<div id="content">
    <!--<header></header>-->
    ${contentComment}
    <ul id="page"></ul>
</div>
<footer>
    <div class="left">Copyright &copy; 2017 Hugh Shen, theme inspired by <a href="https://github.com/probberechts/cactus-dark" target="_blank">Cactus Dark</a></div>
    <div class="right">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="https://github.com/hughshen" target="_blank">Github</a></li>
        </ul>
    </div>
</footer>
<script>
var items = document.querySelectorAll('#list li'),
    show = ${showItems},
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
                items[i].className = 'show';
            } else {
                items[i].className = '';
            }
        }
    },
    all: function() {
        for (var i = 0; i < items.length; i++) {
            items[i].className = 'show';
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
;!function(a,b,c){var d=a.screen,e=encodeURIComponent,f=["dt="+e(b.title),"dr="+e(b.referrer),"ul="+(c.language||c.browserLanguage),"sd="+d.colorDepth+"-bit","sr="+d.width+"x"+d.height],g="?"+f.join("&");a.__ga_img=new Image,a.__ga_img.src="/ga.html"+g}(window,document,navigator,location);
</script>
</body>
</html>
    `,
}

module.exports = config;
