<!-- title:JavaScript 简单计时器 -->
<!-- keywords:JavaScript -->

最近工作中需要做一个活动倒计时的效果，代码很简单，做个记录

```html
<!DOCTYPE html>
<html>
<head>
	<title>Countdown</title>
</head>
<body>

<h1 id="tick">00:00:00</h1>

<script>

var handler = setInterval(function() {
    updateTick(document.querySelector('#tick'), handler)
}, 1000);

function updateTick(ele, handler) {
    var start = new Date(1468242903875),
        end = new Date();

    var d = end - start,
        h = Math.floor((d / (1000 * 60 * 60))),
        m = Math.floor((d / (1000 * 60)) % 60),
        s = Math.floor((d / 1000) % 60);

    m = (m < 10) ? '0' + m : m;
    s = (s < 10) ? '0' + s : s;

    ele.textContent = h + ':' + m + ':' + s;
}
</script>
</body>
</html>
```