<!-- title:使用 GitHub Webhooks 部署网站 -->
<!-- keywords:GitHub, Webhooks, Node.js -->

之前在更新文章的过程中，需要做的事情有两件：备份文章到 GitHub 和本地创建静态文件并提交到服务器 ([Git Hooks](/post/git-hooks-note.html))，感觉上还是有点麻烦，而且 VPS 已经禁止密码登录 ([SSH 密钥登录](/post/ssh-key-authentication.html))，而刚好 GitHub 为每个仓库提供了 Webhook 功能，简单来说，当 push 事件触发时，GitHub 会发送一个 POST 请求到我们配置的地址，这样当我们提交之后就可以通过脚本来自动化部署网站，部署过程也不麻烦，做个记录。

所有的脚本都是在当前用户 (非 root) 下进行的，这个可能需要注意下

以本网站的代码仓库为例：[blog](https://github.com/hughshen/blog)

## 服务器配置

由于生成静态文件需要 pull 最新的文件，所以把 Blog 仓库拉到服务器

```shell
# 进入到网站目录，假设网站目录是 /var/www/html/blog/static
cd /var/www/html/blog
git clone https://github.com/hughshen/blog.git repo
```

由于我是用 Node.js 来生成静态文件，所以就以 Node.js 来做 Webhook 响应，中间使用了第三方库 [github-webhook-handler](https://github.com/rvagg/github-webhook-handler) 来处理 push 事件，Node.js 安装可以看[这里](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

```shell
mkdir ~/blog-build
cd ~/blog-build
# 初始化
npm init -y
npm install github-webhook-handler --save
# Node.js 端口监听文件
touch index.js
# 自动化部署脚本
touch build.sh
chmod a+x build.sh
```

index.js 内容

```javascript
const http = require('http');
const port = 1234;
const exec = require('child_process').exec;
const createHandler = require('github-webhook-handler');
const handler = createHandler({
    path: '/webhook',
    secret: 'your_secret'
});

http.createServer((req, res) => {
    handler(req, res, (err) => {
        res.statusCode = 404;
        res.end('no such location');
    });
}).listen(port, 'localhost');

handler.on('error', (err) => {
    console.error('Error:', err.message);
});

handler.on('push', (event) => {
    exec('~/blog-build/build.sh', (err, stdout, stderr) => {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (err !== null) {
            console.log('exec error: ' + err);
        }
    });
    console.log('Received a push event for %s to %s',
        event.payload.repository.name,
        event.payload.ref
    );
});
```

build.sh 内容

```shell
#!/bin/bash

CurrentPath=`pwd`
GitPath='/var/www/html/blog/repo/'

cd $GitPath
git pull origin master
npm install
node build.js
cp -rf ./static/* ../static/
rm -rf ./static

cd $CurrentPath
exit 0
```

上面的 index.js 监听的 1234 端口只允许本服务器访问，还需要修改 nginx 的配置使得可以外部访问

```
# ...
location ~ /webhook {
	# 只允许 POST 请求
    if ($request_method !~ ^(POST)$) {
        return  444;
    }
    proxy_pass http://127.0.0.1:1234;
}
# ...
```

重启 nginx，接下来启动 index.js

```shell
nohup /usr/bin/node /home/user/blog-build/index.js >/dev/null 2>&1 &
```

**添加到自启动**

添加 index.js 到自启动我使用的是 crontab @reboot 命令，使用 `crontab -e` 添加下面一行，网上也有说可以用 `su - user -c "command"` 添加到 rc.local 的，但是我添加了重启过几次没有生效

```shell
# ...
@reboot nohup /usr/bin/node /home/user/blog-build/index.js >/dev/null 2>&1 &
```

## GitHub 配置

GitHub 开启 Webhook 很简单，找到仓库 Settings -> Webhooks -> Add webhook

> Payload URL: http://example.com/webhook

> Content type: application/json

> Secret: your_secret

添加完之后 GitHub 会发送一个测试的请求，失败的话可以找下问题，然后点击 Redeliver 再次发送

## 小结

总的来说，配置过程也简单，如果项目是依赖于 GitHub 或者有关的话，使用 Webhooks 是很方便的，一切都自动化，只需提交代码就行。

---

## 参考

[使用Github的webhooks进行网站自动化部署](https://aotu.io/notes/2016/01/07/auto-deploy-website-by-webhooks-of-github/)

[How do I use the nohup command without getting nohup.out?](https://stackoverflow.com/questions/10408816/how-do-i-use-the-nohup-command-without-getting-nohup-out)