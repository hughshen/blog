<!-- title:在 htaccess 文件中设置字符集 -->
<!-- keywords:htaccess -->

网站首页访问 index.html，显示是乱码。本来访问 index.php 文件是没问题的，所以可以在 apache 中使用 DirectoryIndex index.php index.html 来修改默认 index 文件，老严说可以使用 htaccess 文件来设置默认 charset，google 找到了类似的，作个记录。

在 .htaccess 文件中添加

```
AddDefaultCharset UTF-8
AddCharset UTF-8 .html
AddType 'text/html; charset=UTF-8' html
```

另外，帖子链接中有提到 FilesMatch，例如

```
<FilesMatch "\.(htm|html|css|js|php)$">
AddDefaultCharset UTF-8
DefaultLanguage en-US
</FilesMatch>
```

使用 FilesMatch 应该是更好的写法，虽然第一种就可以满足我的要求了。

---

## 参考

[Setting charset in htaccess](http://www.askapache.com/htaccess/setting-charset-in-htaccess.html)

[Using FilesMatch and Files in htaccess](http://www.askapache.com/htaccess/using-filesmatch-and-files-in-htaccess.html)
