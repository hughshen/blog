<!-- title:数据库密码包含 HTML 实体的一个小坑 -->

今天安装 OpenCart 模板的时候，在输入数据库信息这一步报账号密码错误，但是测试过数据库是能够连接的，感觉好奇怪

定位到安装模板时数据库连接的代码 (主题支持的 OpenCart 版本比较旧)

```php
if ($this->request->post['db_driver'] == 'mysql') {
	if (!$connection = @mysql_connect($this->request->post['db_host'], $this->request->post['db_user'], $this->request->post['db_password'])) {
		$this->error['warning'] = 'Error: Could not connect to the database please make sure the database server, username and password is correct!';
	} else {
		if (!@mysql_select_db($this->request->post['db_name'], $connection)) {
			$this->error['warning'] = 'Error: Database does not exist!';
		}

		mysql_close($connection);
	}
}
```

账号密码都是 POST 过来的，看起来没什么问题，把代码改成直接填密码看下

```php
if ($this->request->post['db_driver'] == 'mysql') {
	if (!$connection = @mysql_connect('localhost', 'username', 'password')) {
		$this->error['warning'] = 'Error: Could not connect to the database please make sure the database server, username and password is correct!';
	} else {
		if (!@mysql_select_db('db_name', $connection)) {
			$this->error['warning'] = 'Error: Database does not exist!';
		}

		mysql_close($connection);
	}
}
```

之前测试数据库是能通过的，所以安装应该是能完成的，但是安装完之后打开网站却又显示数据库连接密码错误，查看下 config 配置文件，看到数据库密码就知道原因了，因为我之前的密码包含 HTML 实体，比如 `123&456`，在提交表单获取密码后变成了 `123&amp;456`，所以密码就是错误的，不知道这是 OpenCart 的问题还是其他的什么原因，记录一下，免得又跳坑