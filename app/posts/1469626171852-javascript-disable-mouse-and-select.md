<!-- title:JavaScript 禁止鼠标事件 -->
<!-- keywords:JavaScript -->

有些网站要求禁止鼠标功能，比如禁止选择文字，禁止右键菜单等，做个记录

```javascript
// 禁止右键点击
document.oncontextmenu = function() {
	return false;
};
window.onmousedown = function () {
	if (window.event) {
		if (event.button == 2) {
			return false;
		}
	}
}
// 禁止复制粘贴
document.onselectstart = function() {
	return false;
}
```