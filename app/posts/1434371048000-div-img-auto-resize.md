<!-- title:DIV 下图片自动按比例缩放 -->
<!-- keywords:HTML, CSS -->

在固定 DIV 的宽和高后，DIV 里面的图片能够自动按比例进行缩放，并实现左右上下居中，图片大小不一定；一开始想到的是使用 javascript 解决。

```javascript
img.onload = function() {
	//DIV 最大宽和高
	var maxWidth = 500;
	var maxHeight = 500;
	//取得初始化图片大小
	var imgWidth = this.width;
	var imgHeight = this.height;
	//获取图片原始大小
	if (this.naturalWidth) { // HTML5 Borwser
	  imgWidth = this.naturalWidth
	  imgHeight = this.naturalHeight
	} else { // IE6/7/8
	  var newImgNode = new Image()
	  newImgNode.src = this.src
	  imgWidth = newImgNode.width;
	  imgHeight = newImgNode.height;
	}
	//对大于指定宽高的图片大小做处理
	if ((imgWidth > maxWidth) || (imgHeight > maxHeight)) {
	  var k = imgWidth/imgHeight;
	  if (imgWidth > imgHeight) {
	    imgWidth = maxWidth;
	    imgHeight = Math.floor(imgWidth/k);
	  } else {
	    imgHeight = maxHeight;
	    imgWidth = Math.floor(imgHeight*k);
	  }
	}
	//设置 img 的宽和高
	this.width = imgWidth;
	this.height = imgHeight;
	}
}
```

使用 onload 方法不能保证每次加载都能对图片进行缩放处理，有时候需要刷新几次才能看到效果，不知道是不是图片太大的原因。

后来找资料的时候看到可以使用 css 来处理，效果不错。

```css
<style type="text/css">
	div {
		width: 500px;
		height: 500px;
		display: table-cell; /*实现垂直居中的前提*/
		vertical-align: middle;
		text-align: center;
		text-align: -webkit-center;
		text-align: -moz-center;
	}
	div img {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
	}
</style>
```

## 2015-06-24

今天使用的时候图片没有垂直居中效果，想了一个笨方法。 

```css
<style type="text/css">
	div {
		width: 500px;
		height: 500px;
		text-align: center;
		text-align: -webkit-center;
		text-align: -moz-center;
	}
	div img {
		width: auto;
		height: 100%; /*把图片高度铺满 div*/
		max-width: 100%;
		max-height: 100%;
	}
</style>
```
