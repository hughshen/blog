<!-- title:两个 HTML 页面之间传值 -->
<!-- keywords:HTML -->

项目中有个需求是在两个 html 页面间进行传值，javascript 可以很简单的实现。

*a.html*

```html
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
	<title>A</title>
</head>
<body>
	<a href="b.html?value=1">Redirect to b.html</a>
</body>
</html>

```

*b.html*

```html
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
	<title>B</title>
	<script type="text/javascript" charset="utf-8">
		var url = location.search;
		//去掉问号
		var value = url.split("?")[1];
		alert(value);
		//后面的参数取值可以对字符串进行操作获取
	</script>
</head>
<body>
	
</body>
</html>
```

PS: html 页面之间传递参数还有一些方法，不过不常用到，作个记录，具体看[这里](http://www.uedsc.com/javascript-html-get-value.html)
