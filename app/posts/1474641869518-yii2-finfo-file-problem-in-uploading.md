<!-- title:Yii2 上传文件时出现 finfo_file 问题 -->
<!-- keywords:Yii2 -->

今天在使用 Yii2 上传文件时出现下面的错误 (fileinfo.dll已经开启)，觉得好奇怪，StackOverflow 上有人说需要在 saveAs 保存文件前调用 Model 的 save 方法，这样修改了之后确实可以了，感觉应该是在调用 saveAs 的时候，缓存文件删除了，再调用 save 方法的话，就找不到缓存文件了，作个记录。

```
finfo_file(tmp_path\phpB1CB.tmp): failed to open stream: No such file or directory
```

修改之后的一些代码

```php
if ($model->validate()) {
    if ($model->files) {
        $images = [];
        $saveDir = dirname(\Yii::getAlias('@app')) . '/uploads/';
        foreach ($model->files as $key => $file) {
            $images[] = '/uploads/' . $file->baseName . '.' . $file->extension;
        }
        $model->images = json_encode($images);
        $model->save();

        // 现在开始保存文件
        foreach ($model->files as $key => $file) {
            $savePath = $saveDir . $file->baseName . '.' . $file->extension;
            $file->saveAs($savePath);
        }
    } else {
        $model->save();
    }
}
```

---

## 2016-09-27

今天又遇到了一个上传的问题，是因为 fileinfo 扩展没安装的原因，报的如下错误

```
The PHP extension fileinfo is not installed.
```

因为没有权限扩展，而且又急着测试网站，查看了 Yii2 Validators 文档才知道这个是可以跳过的，只要设置 checkExtensionByMimeType 的值为 false，就行了，例如

```
['imageFiles', 'file', 'extensions' => ['png', 'jpg', 'jpeg', 'gif'], 'mimeTypes' => 'image/*', 'maxFiles' => 5, 'skipOnEmpty' => false, checkExtensionByMimeType' => false],
```

其实查看一下报错页面，一步步找，能找到如下的代码，只是没想到 Yii2 提供了设置

```
if ($checkExtensionByMimeType) {
    // 这里调用 fileinfo 扩展来检测文件的 MIME Type
}
```

---

[File uploading issue in Yii2](http://stackoverflow.com/questions/30161589/file-uploading-issue-in-yii2)

[Yii Framework 2.0 Uploading Files Error finfo_file(): failed to open stream: No such file or directory](http://stackoverflow.com/questions/26998914/yii-framework-2-0-uploading-files-error-finfo-file-failed-to-open-stream-no)

[Core Validators](http://www.yiiframework.com/doc-2.0/guide-tutorial-core-validators.html#file)