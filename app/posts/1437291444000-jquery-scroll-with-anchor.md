<!-- title:jQuery 锚文本滚动 -->
<!-- keywords:JavaScript, jQuery -->

最近项目需要做一个简单的导航栏，需要在页面滚动时自动置顶在上方，并为其中的链接添加 anchor；实现方法是使用 jQuery，下面是简单实现的代码，做个记录。

```html
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
	<title>Test</title>
	<style type="text/css">
		div {border: 1px solid red; margin: 10px auto; color: #000; text-align: center;}
		.header	{background-color: #f00; height: 100px; width: 500px;}
		.tab {background-color: #0f0; height: 20px; width: 500px;}
		.footer {background-color: #00f; height: 2000px; width: 500px;}
	</style>
	<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
	<script type="text/javascript" charset="utf-8">
		$(document).ready(function () {
			//get tabs offset.top
			var tab = $('.tab');
			var tabTop = 99999;
			if (tab.length) {
				tabTop = tab.offset().top;
			}
			//set jQuery scroll event
			$(window).scroll(function () {
				if (tab.length && $(window).scrollTop() > tabTop) {
					tab.css('position', 'fixed');
					tab.css('width', '100%');
					tab.css('top', '0');
				} else {
					tab.css('position', '');
					tab.css('width', '500px');
				}
			});
			//smooth scrolling to anchor
			$('a[href^="#"]').on('click', function (e) {
				e.preventDefault();

				var target = this.hash;
				var $target = $(target);

				$('html, body').stop().animate({'scrollTop':$target.offset().top}, 900, 'swing', function () {
					window.location.hash = target;
				});
			});
		});
	</script>
</head>
<body>
	<div class="header" id="header">header</div>
	<div class="tab">tab--<a href="#header">Go to top</a></div>
	<div class="footer">footer</div>
</body>
</html>
```

下面是一些函数的说明

> preventDefault() 方法阻止元素发生默认的行为 (例如，当点击提交按钮时阻止对表单的提交)

> stop() 方法停止当前正在运行的动画

> animate() 方法执行 CSS 属性集的自定义动画。该方法通过 CSS 样式将元素从一个状态改变为另一个状态。CSS 属性值是逐渐改变的，这样就可以创建动画效果。只有数字值可创建动画 (比如 margin:30px)。字符串值无法创建动画 (比如 background-color:red)

CSS 选择器参考手册

> [attribute]	用于选取带有指定属性的元素

> [attribute=value]	用于选取带有指定属性和值的元素

> [attribute~=value]	用于选取属性值中包含指定词汇的元素

> [attribute|=value]	用于选取带有以指定值开头的属性值的元素，该值必须是整个单词

> [attribute^=value]	匹配属性值以指定值开头的每个元素

> [attribute$=value]	匹配属性值以指定值结尾的每个元素

> [attribute*=value]	匹配属性值中包含指定值的每个元素

---

## 参考

[Smooth Scrolling To Internal Links With jQuery](http://www.paulund.co.uk/smooth-scroll-to-internal-links-with-jquery)

[jQuery 事件 - preventDefault() 方法](http://www.w3school.com.cn/jquery/event_preventdefault.asp)

[jQuery 效果 - stop() 方法](http://www.w3school.com.cn/jquery/effect_stop.asp)

[jQuery 效果 - animate() 方法](http://www.w3school.com.cn/jquery/effect_animate.asp)

[CSS 属性选择器](http://www.w3school.com.cn/css/css_syntax_attribute_selector.asp)
