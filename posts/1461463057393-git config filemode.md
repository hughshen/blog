在使用 `git diff` 时返回如下信息

```bash
old mode 100644
new mode 100755
```

原因是对文件权限进行了修改，如果要忽略 git 对文件权限的监控，修改下 git 的配置就行

```bash
git config core.filemode false
```

可以添加 `--global` 参数，但不会修改当前项目的配置。
