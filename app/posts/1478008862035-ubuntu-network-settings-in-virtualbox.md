<!-- title:VirtualBox 下 Ubuntu 设置上网 -->
<!-- keywords:Ubuntu -->

最近在 VirtualBox 下安装 Ubuntu 玩，但是上网却是时好时坏，对 Linux 下的网络也不怎么懂，网上找了篇教程，暂时还可以用，作个记录。

环境 Windows 10， 虚拟机 Ubuntu Server 1604

有时候网络配置失败，会显示以下信息，需要等大概 5 分钟才能开机，把这个等待时间修改一下

```
A start job is running for raise network interfaces (5 mins 1 sec)
```

修改等待时间

```shell
sudo vim /etc/dhcp/dhclient.conf
# 修改 timeout 300 
timeout 30;
```

修改网卡为静态地址连接，这里使用的是无线连接，首先把虚拟机里面的网络设置修改为桥接网卡，选中宿主机的无线网卡，接着记录宿主机网络的 IP 地址、子网掩码、默认网关与 DNS 服务器等信息

修改网卡配置

```shell
# 以下是默认配置
# 网卡是 enp0s3 或 eth0 无所谓，enp0s3 是 Ubuntu 1604 的新属性，dhcp 是指动态获取 IP 地址

cat /etc/network/interfaces
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

# The primary network interface
auto enp0s3
iface enp0s3 inet dhcp
```

修改为静态 IP 地址

```shell
sudo vim /etc/network/interfaces
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

# The primary network interface
auto enp0s3
# iface enp0s3 inet dhcp
iface enp0s3 inet static
# IP 地址随便填写，注意不要跟其他有冲突，主要修改最后一组数字
address 192.168.1.108
# 子网掩码
netmask 255.255.255.0
# 广播网络，好像没有也是可以的，注意跟 IP 地址类似，最后一组数字为 0
network 192.168.1.0
# 默认网关
gateway 192.168.1.1
# DNS 服务器，可以设置多个
dns-nameservers 8.8.8.8
dns-nameservers 114.114.114.114
dns-nameservers your_dns_server
```

修改完之后重启网络

```shell
sudo service networking restart
```

暂时可以先用着，不过有个小问题，有时候一开机网络连接失败，这时候重启网络就行了

PS: 有时间再去研究下 Linux 的网络配置

**2017-02-25**

可以添加开机启动项，在 `/etc/rc.local` 中添加

```shell
service networking restart
```

---

## 参考

[VirtualBox虚拟机Ubuntu下如何设置无线上网](http://www.linuxidc.com/Linux/2016-07/133301.htm)