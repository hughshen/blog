<!-- title:Yii2 修改入口文件位置 -->
<!-- keywords:Yii2 -->

高级模板中，有 frontend 和 backend 两个目录，在移动到根目录时，还需要修改 config/main.php 文件，将 frontend 中的入口文件移到根目录，首先在根目录中添加 index.php 文件

```php
<?php
defined('YII_DEBUG') or define('YII_DEBUG', true);
defined('YII_ENV') or define('YII_ENV', 'dev');

require(__DIR__ . '/vendor/autoload.php');
require(__DIR__ . '/vendor/yiisoft/yii2/Yii.php');
require(__DIR__ . '/common/config/bootstrap.php');
require(__DIR__ . '/frontend/config/bootstrap.php');

$config = yii\helpers\ArrayHelper::merge(
    require(__DIR__ . '/common/config/main.php'),
    require(__DIR__ . '/common/config/main-local.php'),
    require(__DIR__ . '/frontend/config/main.php'),
    require(__DIR__ . '/frontend/config/main-local.php')
);

$application = new yii\web\Application($config);
$application->run();
```

再修改 frontend/config/main.php，在 components 中添加以下设置

```php
'assetManager' => [
    'basePath' => '@webroot/frontend/web/assets',
    'baseUrl' => '@web/frontend/web/assets'
],
```

最后再修改下 AppAsset.php 文件

```php
public $basePath = '@webroot/frontend/web/';
public $baseUrl = '@web/frontend/web/';
```

如果将 backend 的入口文件移动到根目录的话，也是一样的做法。

~~如果只是移动到 backend 目录下的话，就不用修改 /config/main.php 文件了，只需修改 index.php 和 AppAsset.php 就行。~~

添加 backend 入口文件后，还要修改以下两个文件

```php
// backend/config/main.php, components 下添加 assetManager 配置
'assetManager' => [
    'basePath' => '@webroot/web/assets',
    'baseUrl' => '@web/web/assets'
],

// backend/assets/AppAsset.php
public $basePath = '@webroot/web/';
public $baseUrl = '@web/web/';
```
