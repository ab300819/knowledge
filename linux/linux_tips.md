# Linux Tips

## 移除 Ubuntu 上陈旧的 PPA 仓库

1. `sudo apt-get update | grep "Failed"`

```
Err http://ppa.launchpad.net trusty/main amd64 Packages 404  Not Found

Err http://ppa.launchpad.net trusty/main i386 Packages  404  Not Found

W: Failed to fetch http://ppa.launchpad.net/finalterm/daily/Ubuntu/dists/trusty/main/binary-amd64/Packages  404  Not Found

W: Failed to fetch http://ppa.launchpad.net/finalterm/daily/ubuntu/dists/trusty/main/binary-i386/Packages  404  Not Found

E: Some index files failed to download. They have been ignored, or old ones used instead.
```

2. `sudo add-apt-repository --remove ppa:finalterm/daily`

## `wc` 命令

> 可以计算文件的 Byte 数、字数、或是列数，若不指定文件名称或是所给予的文件名为 `-`，则 `wc` 指令会从标准输入设备读取数据。

- 语法

```bash
wc [-clw][--help][--version][文件...]
```

- 参数
  - `-c` 或 `--bytes` 或 `--chars` 只显示 Bytes 数；
  - `-l` 或 `--lines` 只显示行数；
  - `-m` 统计字符数，这个标志不能与 `-c` 标志一起使用；
  - `-w` 或 `--words` 只显示字数；
  - `-L` 打印最长行的长度；
  - `--help` 在线帮助；
  - `--version` 显示版本信息；

* 例子

```
$ wc testfile           # testfile文件的统计信息
3 92 598 testfile       # testfile文件的行数为3、单词数92、字节数598
```

## 统计文件或目录个数

- 统计当前文件夹下文件的个数，包括子文件夹里的

```bash
ls -lR|grep "^-"|wc -l
```

- 统计文件夹下目录的个数，包括子文件夹里的

```bash
ls -lR|grep "^d"|wc -l
```

- 统计当前文件夹下文件的个数

```bash
ls -l |grep "^-"|wc -l
```

- 统计当前文件夹下目录的个数

```bash
ls -l |grep "^d"|wc -l
```

附：

- 统计输出信息的行数

```bash
wc -l
```

- 将长列表输出信息过滤一部分，只保留一般文件，如果只保留目录就是 `^d`

```bash
grep "^-"
```
