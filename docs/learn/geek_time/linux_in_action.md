# Linux实战技能100讲

## 系统管理

### 查看网络配置

#### 网卡名称规律

|   网卡名称    |   网卡类型    |
|   --- |   --- |
|   `eno1`  |   板载⽹网卡   |
|   `ens33`   |   PCI-E⽹网卡    |
|   `enp0s3`  |   ⽆无法获取物理理信息的 PCI-E ⽹网卡   |
|   `eth0`  |   第一块网卡（一致性网络设备命名）   |

#### 网卡命名修改

网卡命名规则受 `biosdevname` 和 `net.ifnames` 两个参数影响;

编辑 `/etc/default/grub` 文件，在 `GRUB_CMDLINE_LINUX` 参数追加 `biosdevname=0 net.ifnames=0`

更新 grub

```bash
# CentOS
grub2-mkconfig -o /boot/grub2/grub.cfg

# Debian
update-grub
```

参数组合

|    |   `biosdevname` |   `net.ifnames`   |    ⽹网卡名    |
|   --- |   --- |   --- |   --- |
|   默认  |   `0` |   `1` |   `ens33` |
|   组合1 |   `1` |   `0` |   `em1`   |
|   组合2 |   `0` |   `0` |   `eth0`  |

#### 查看网络连接

```bash
mii-tool eth0
```

#### 参看网关命令

```bash
# 使用 -n 参数不解析主机名
route -n
```

## 第五章 文本操作篇



## 服务管理篇
### 防火墙概述
`filter` 过滤表，允许或不允许通过
`nat` 网络地址转换

规则链
INPUT
`PREROUTING` - 路由前处理
`POSTROUTING` - 路由后处理