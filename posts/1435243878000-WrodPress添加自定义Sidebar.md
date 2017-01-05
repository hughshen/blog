找到一篇很好的学习教程，感谢作者，具体看[这里](https://www.tastyplacement.com/add-sidebar-wordpress)。PS：貌似需要 FQ 才能访问-_-!

首先在 functions.php 文件下注册 sidebar

```php
if ( function_exists('register_sidebar') ) {
	register_sidebar(array(
		'name' => 'Homepage Sidebar',
		'id' => 'homepage-sidebar',
		'description' => 'Appears as the sidebar on the custom homepage',
		'before_widget' => '<div style="height: 280px"></div><li id="%1$s" class="widget %2$s">',
		'after_widget' => '</li>',
		'before_title' => '<h2 class="widgettitle">',
		'after_title' => '</h2>',
	));
}
```

然后可以在后台 widgets 页面下看到新添加的 sidebar

创建一个自定义的 sidebar 文件

例如 sidebar-homepage.php，添加代码 (可以复制 sidebar.php 源文件)

```php
<div id="sidebar">
   <ul>
      <?php
      if ( !function_exists('dynamic_sidebar') || !dynamic_sidebar('homepage-sidebar') ) :
      endif; ?>
   </ul>
</div>
```

PS：注意 homepage-sidebar 为注册 sidebar 时的 id

在 theme 中调用自定义的 sidebar

sidebar 文件有一个统一的命名：sidebar-custom_name.php，在需要调用时可以用 get_sidebar() 函数

例如在 template 文件中加入代码

```php
<?php get_sidebar('homepage'); ?>
```
