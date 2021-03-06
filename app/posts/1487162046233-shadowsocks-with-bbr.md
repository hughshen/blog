<!-- title:Shadowsocks 使用 BBR 加速 -->
<!-- keywords:Shadowsocks, BBR -->

之前有使用过 Vultr JP 节点的 VPS 来部署 SS，但是时不时丢包，用得不是很顺畅，最近看到 BBR 很好用的样子，配置简单且开源，决定试一试，部署很简单，主要是升级内核到 4.9 以上然后开启就行，由于 BBR 不支持 OpenVZ，所以 Bandwagonhost 的 VPS 应该是不能升级内核的，目前使用的是 Vultr，系统是 Ubuntu 1604 64 bit。

本文章安装过程参考 [比锐速还强的 TCP拥塞控制技术 —— TCP-BBR 测试及开启教程](https://doub.io/wlzy-15/)，并没有新的内容，只是做个记录，感谢作者。

所有命令都在 root 账号下执行 `su root`

## 更新内核

内核版本可以到 [这里下载](http://kernel.ubuntu.com/~kernel-ppa/mainline/)，目前使用版本是 4.9.10

```shell
wget -O linux-image-4.9.10-amd64.deb http://kernel.ubuntu.com/~kernel-ppa/mainline/v4.9.10/linux-image-4.9.10-040910-generic_4.9.10-040910.201702141931_amd64.deb
# Install
dpkg -i linux-image-4.9.10-amd64.deb
```

显示 done 表示安装完成

## 删除旧内核

```shell
# 查看当前已安装的内核
dpkg -l | grep linux-image | awk '{print $2}'
# 删除旧内核
apt-get purge 旧内核名称
```

如果删除旧内核的过程中提示你是否继续，选择 Y，然后还会提示你是否终止删除内核的行为，选择 NO

内核更新完之后，需要更新系统引导文件并重启

```shell
# 更新系统引导文件，会自动寻找内核
update-grub
# 重启，需要重新登录 VPS
reboot
```

## BBR 配置

修改配置之后重启 `reboot`

开启 BBR

```shell
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
# 使配置生效
sysctl -p
```

关闭 BBR

```shell
sed -i '/net\.core\.default_qdisc=fq/d' /etc/sysctl.conf
sed -i '/net\.ipv4\.tcp_congestion_control=bbr/d' /etc/sysctl.conf
sysctl -p
```

是否开启 BBR

```shell
# 如果有 bbr 出现的话，说明已经开启
sysctl net.ipv4.tcp_available_congestion_control
# 如果有 bbr 出现的话，说明已经启动
lsmod | grep bbr
```

PS：目前使用联通，YouTube 能跑到 10000+ Kbps，之前顶多就是 1500 Kbps，用着还不错，明天到公司用电信来试下效果。

**2017-02-16**

使用电信效果没那么好，YouTube 大概能跑到 2500+ Kbps，也是容易丢包，不过使用起来感觉是比之前的快了不少，还不错。

---

## 参考

[比锐速还强的 TCP拥塞控制技术 —— TCP-BBR 测试及开启教程](https://doub.io/wlzy-15/)

[开启TCP BBR拥塞控制算法](https://github.com/iMeiji/shadowsocks_install/wiki/%E5%BC%80%E5%90%AFTCP-BBR%E6%8B%A5%E5%A1%9E%E6%8E%A7%E5%88%B6%E7%AE%97%E6%B3%95)
