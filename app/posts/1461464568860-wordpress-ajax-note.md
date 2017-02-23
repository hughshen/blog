<!-- title:WordPress Ajax 简单使用 -->
<!-- keywords:WordPress, Ajax -->

使用 Wordpress 自带的 Ajax 方法，需要先定义 action

```php
add_action('wp_ajax_nopriv_example_test', 'example_test');
add_action('wp_ajax_example_test', 'example_test');
function example_test() {
	$name = $_POST['name'];
	header('Content-Type: application/json');
	$json = array();
	$json['msg'] = 'Hello ' . $name;
	echo json_encode($json);
	exit;
}
```

然后在前端页面调用就行，例如使用 jQuery

```javascript
jQuery.ajax({
	type: 'POST',
	// url 路径必须带 'wp-admin/admin-ajax.php'
	url: "http://www.example.com/wp-admin/admin-ajax.php",
	data: {
		// 这里需要填写已定义的 action
		action: 'example_test',
		name: 'World'
	},
	datatype: 'html',
	success: function(json) {
		console.log(json);
	},
	error: function(msg) {
		console.log(msg);
	}
});
```
