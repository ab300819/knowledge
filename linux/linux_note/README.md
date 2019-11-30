# Introduction

---

linux 鸟哥私房菜

## [文件权限与目录配置](5.md)

## [文件与目录管理](6.md)

## [磁盘与文件系统管理](7.md)

## [压缩与打包](8.md)

- 系统常见的压缩命令
    - `gzip` 和 `zcat`/`zmore`/`zless`/`zgrep`
    - `bzip2` 和 `bzcat`/`bzmore`/`bzless`/`bzgrep`
    - `xz` 和 `xzcat`/`xzmore`/`xzless`/`xzgrep`
- 打包 `tar`
- 完整备份工具
    - 8.4.1 `XFS` 文件系统备份 `xfsdump`
    - 8.4.2 `XFS` 文件系统还原 `xfsrestore`
    - 通用备份与还原工具
- 光盘写入工具
    - 创建镜像
    - 光盘刻录

## [账号管理与 ACL 权限控制](13.md)

- 账号管理与 ACL 权限控制
    - 的账号与用户组
        - 用户账号
        - 有效与初始用户组 groups 和 newgrp
    - 账号管理
        - 新增与删除用户
            - `useradd` 参考文件
            - `passwd`
            - `change`
            - `usermod`
            - `userdel`
        - 用户功能
            - `id`
            - `finger`
            - `chfn`
            - `chsh`
        - 新增与删除用户组
            - `groupadd`
            - `groupmod`
            - `groupdel`
            - `gpasswd`
        - 账号管理实例
    - 主机的具体权限规划 ACL
        - ACl
        - ACL 的设定技巧
            - `setfacl` 用法
            - `getfacl` 用法
    - 用户身份切换
        - `su`
        - sudo
            - `visudo` 与 `/etc/sudoers`
                - 单一用户可进行 root 所有命令，与 sudoers 文件语法
                - 利用 wheel 群组以及免口令的功能处理 `visudo`
                - 有限制的命令操作
                - 通过别名设置 `visudo`
                - `sudo` 的时间间隔问题
                - `sudo` 搭配 `su` 的使用方式
    - 用户的特殊 shell 与 PAM 模块
        - PAM 模块设置语法
        - 常用模块简介
        - 其他相关文件
    - Linux主机上的用户信息传递
        - 查询用户
            - `w`
            - `who`
            - `lastlog`
        - 用户对谈
            - `write`
            - `wall`
        - 用户邮件信箱

## [磁盘配额 Quota 的应用与实践](14.md)

- 磁盘配额 Quota 的应用与实践
    - Quota 概念
    - Quota 范例
    - 实践 Quota 流程1 文件系统支持
    - 实作 Quota 流程2 观察 Quota 报告资料
    - 实践Quota流程3 限制值设定方式
    - 实践 Quota 流程4 针对目录限制
    - XFS quota 的管理与额外指令对照表

## [软件磁盘阵列 Software RAID](14.2.md)

- 软件磁盘阵列 Software RAID
    - 软件磁盘阵列的设置
    - 仿真 RAID 错误的救援模式
    - 开机自动启动 RAID 并自动挂载
    - 关闭软件 RAID

## [逻辑卷管理器 Logical Volume Manager](14.3.md)

- 逻辑卷管理器 Logical Volume Manager
    - 一些概念
    - LVM 实作流程
    - 放大 LV 容量
    - 缩小 LV 容量
    - 使用 LVM thin Volume 让 LVM 动态自动调整磁盘使用率
    - LVM 的系统快照
    - LVM 相关命令汇整与 LVM 的关闭

## [仅执行一次的工作调度](15.2.md)

- 仅执行一次的工作调度
    - `atd` 的启动与 `at` 运行的方式
    - 实际运行单一工作制度

## [循环执行的例行性工作调度](15.3.md)

-  循环执行的例行性工作调度
    - 用户设置
    - 系统的配置文件

## [可唤醒停机期间的工作任务](15.4.md)

- 可唤醒停机期间的工作任务
    - `anacron` 与 `/etc/anacrontab`

## [工作管理 job control](16.2.md)

- 工作管理 job control
    - job control 的管理
    - 脱机管理问题

## [进程管理](16.3.md)

- 进程管理
    - 进程的查看
    - 进程的管理
    - 关于进程的
    - 系统资源的观察

## [特殊文件与程序](16.4.md)

- 具有 SUID/SGID 权限的命令运行状态
- `/proc/*` 代表的意义
- 查询已开启文件或已运行程序开启之文件

## [SELinux 初探](16.5.md)

- SELinux 的启动 关闭与观察
- SELinux 网络服务运行范例
- SELinux 所需的服务
- SELinux 的政策与守则管理

## [daemon 与 service](17.1.md)

- daemon 的主要分类
- daemon 的启动脚本与启动方式


## [解析 super daemon 的配置文件](17.2.md)

- 17.2.1 默认值配置文件
- 17.2.2 rsync 配置案例

## [服务的防火墙管理](17.3.md)

- `/etc/hosts.allow` 和 `/etc/hosts.deny` 管理
- TCP Wrappers 特殊功能

## [系统开启的服务](17.4.md)

- 观察系统启动的服务
- 配置启动后立即启动服务的方法

## [登陆文件](18.1.md)

## [syslogd 记录登录文件的服务](18.2.md)

- syslog 的配置文件
- 登录文件的安全性配置
- 登录文件服务器的配置

## [登陆文件的轮替 logrotate](18.3.md)

- 实际测试 logrotate 的动作

## [systemd start](systemd\systemd_start.md)

## [daemon 与 service(systemd)](systemd\17.1.md)

- systemd 使用的 unit 分类

## [通过 `systemctl` 管理服务](systemd\17.2.md)

- 通过 `systemctl` 管理服务
- 通过 `systemctl` 观察系统上所有的服务
- 通过 `systemctl` 管理不通操作环境
- 通过 `systemctl` 分析服务之间依赖关系

## [`systemctl` 针对 timer 的配置文件](systemd\17.4.md)

- `systemctl` 针对 timer 的配置文件

## [登陆文件](systemd\18.1.md)

- 登陆文件

## [syslogd 记录登录文件的服务](systemd\18.2.md)

- syslog 的配置文件
- 登录文件的安全性配置
- 登录文件服务器的配置

## [登陆文件的轮替 logrotate](systemd\18.3.md)

- logrotate 的配置文件
- 实际测试 logrotate 的动作
- 自订登录文件的轮替功能

## [启动流程分析](19.1.md)

- 启动流程
- BIOS, boot loader 与 kernel 加载
- 第一个程序 init 及配置文件 `/etc/inittab` 与 runlevel

## [核心与核心模块](19.2.md)

- 核心模块与相依性
- 核心模块的观察
- 核心模块的加载与移除

## [Boot loader](19.3.md)

- boot loader 的两个 stage
- grub 的配置档 `/boot/grub/menu.lst` 与菜单类型
- initrd 的重要性与创建新 initrd 文件
- 测试与安装 grub
- 启动前的额外功能修改
- 关於核心功能当中的 vga 配置
- 为个别菜单加上口令

## [Grub2](19.3(add).md)

- boot loader 的两个 stage
- grub2 的设定文件 `/boot/grub2/grub.cfg`
- grub2 设定文件维护 `/etc/default/grub` 与 `/etc/grub.d`
- initramfs 的重要性与建立新 initramfs 文件
- 测试与安装 grub2

## [启动过程的问题解决](19.4.md)

- 忘记 root 口令的解决之道
- init 配置档错误
- BIOS 硬盘对应的问题 (device.map)
- 因文件系统错误而无法启动

## [启动过程的问题解决](19.4(add).md)

- 忘记 root 密码的解决之道
- 直接开机以 root 执行 bash 的方法

## [系统基本设定](20.md)
## [利用 CUPS 配置 linux 打印机](21.2.md)
## [硬件数据收集与驱动及 lm_sensors](21.3.md)
## [RPM 软件管理程序](23.2.md)
## [SRPM 的使用](23.3.md)
## [系统基本设定](24.1.md)
## [服务器硬件信息](24.2.md)

## [备份要点](24.3.md)

- 推荐备份目录
    - `/etc`
    - `/home`
    - `/root`
    - `/var/spool/mail/`
    - `/var/spool/cron/`
    - `/var/spool/at/`
    - `/var/lib/`

- 不需要备份目录
    - `/dev`
    - `/proc`
    - `/sys`
    - `/run`
    - `/mnt`
    - `/media`
    - `/tmp`
