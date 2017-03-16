const showItems = 10;
const metaComment = '<!-- meta -->';
const styleComment = '<!-- style -->';
const contentComment = '<!-- content -->';

const config = {
    title: 'Hugh\'s Blog',
    keywords: 'Blog, Hugh Shen, hughshen, Linux, PHP, JavaScript, HTML, JS, CSS, Yii, WordPress',
    description: 'But he\'s never bought a lottery ticket',
    postsDir: './app/posts',
    styleFile: './app/style.less',
    staticDir: './static',
    staticPostDir: 'post',
    showItems: showItems,
    sitemap: true,
    siteUrl: 'https://hughss.com',
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
#list li { display: block !important; }
#page { display: none; }
</style>
</noscript>
</head>
<body>
<div id="content">
    <!--<header></header>-->
    ${contentComment}
</div>
<footer>
    <div class="left">Copyright &copy; 2017 Hugh Shen, theme inspired by <a class="themeby" href="https://github.com/probberechts/cactus-dark" target="_blank">Cactus Dark</a></div>
    <div class="right">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="https://github.com/hughshen" target="_blank">Github</a></li>
        </ul>
    </div>
</footer>
<script>
var items = document.querySelectorAll('#list li'),
    showItems = ${showItems},
    totalItams = items.length,
    totalPage = Math.ceil(totalItams / showItems),
    prevDom = document.querySelector('#page .prev'),
    nextDom = document.querySelector('#page .next');
var page = {
    index: 1,
    prev: function() {
        if (this.index > 1) {
            nextDom.style.display = 'inline';
            this.showPage(--this.index);
            if (this.index == 1) prevDom.style.display = 'none';
        }
    },
    next: function() {
        if (this.index < totalPage) {
            prevDom.style.display = 'inline';
            this.showPage(++this.index);
            if (this.index == totalPage) nextDom.style.display = 'none';
        }
    },
    showPage: function() {
        var startKey = (this.index - 1) * showItems;
        var endKey = startKey + showItems;
        for (var i = 0; i < totalItams; i++) {
            if (i >= startKey && i < endKey) {
                items[i].className = 'show';
            } else {
                items[i].className = '';
            }
        }
    }
}
;!function(a,b,c){var d=a.screen,e=encodeURIComponent,f=["dt="+e(b.title),"dr="+e(b.referrer),"ul="+(c.language||c.browserLanguage),"sd="+d.colorDepth+"-bit","sr="+d.width+"x"+d.height,"dl="+e(a.location.href)],g="?"+f.join("&");a.__ga_img=new Image,a.__ga_img.src="/ga.html"+g}(window,document,navigator,location);
</script>
</body>
</html>
    `,
}

module.exports = config;
