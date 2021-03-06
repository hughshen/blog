<!-- title:CSS 把 Footer 固定在页面底部 -->
<!-- keywords:CSS -->

有些网站要求当内容不够时把底部固定，实现方法使用的是 Yii 框架自带的，提取出来作个记录

基本 DOM 结构

```html
<html>
	<body>
		<div id="wrap">
			<header>Header</header>
		</div>
		<footer>Footer</footer>
	</body>
</html>
```

底部标签 `footer` 放在主内容 `<div id="wrap">` 外面，需要给 footer 固定一个高度，主要样式都在 `html`、`body`、`#wrap`、`footer`，另外需要注意为这几个选择器添加样式 `box-sizing: border-box`，这样在使用 `padding` 的时候就会把值计算在内而不是外

下面是完整代码

```html
<!DOCTYPE html>
<html>
<head>
    <title>Make footer stick to bottom of page</title>
    <style>
        * {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            text-align: center;
            margin: 0;
            padding: 0;
        }
        html, body {
            height: 100%;
        }
        #wrap {
            min-height: 100%;
            height: auto;
            padding-bottom: 80px;
            margin-bottom: -80px;
        }
        h2 {
            height: 100%;
            line-height: 80px;
        }
        h2 span {
            font-size: 12px;
            color: #fff;
        }
        header {
            background: blue;
        }
        footer {
            background: gray;
            height: 80px;
            /*overflow: hidden;*/
        }
    </style>
</head>
<body>
    <div id="wrap">
        <header>
            <h1>Header</h1>
        </header>
        <div class="content">
            <div class="content-head">
                <button id="add">Add</button>
                <button id="delete">Delete</button>
            </div>
            <div id="content-wrap" class="content-wrap">
                <p>Content+++++++++++++++++</p>
                <p>Content+++++++++++++++++</p>
                <p>Content+++++++++++++++++</p>
                <p>Content+++++++++++++++++</p>
                <p>Content+++++++++++++++++</p>
                <p>Content+++++++++++++++++</p>
                <p>Content+++++++++++++++++</p>
                <p>Content+++++++++++++++++</p>
            </div>
        </div>
    </div>
    <footer>
        <h2>Footer <span>(height is 80px)</span></h2>
    </footer>

    <script>
        var addBtn = document.getElementById('add');
        var delBtn = document.getElementById('delete');
        var wrap = document.getElementById('content-wrap');
        addBtn.addEventListener('click', function() {
            var tmp = document.createElement('p');
            tmp.innerHTML = 'Content+++++++++++++++++';
            wrap.appendChild(tmp);
        });
        delBtn.addEventListener('click', function() {
            wrap.removeChild(wrap.lastChild);
        });
    </script>
</body>
</html>
```