<!-- TOC -->

- [Docker 笔记](#docker-笔记)
    - [安装方式](#安装方式)
    - [基本操作](#基本操作)
        - [在交互方式中运行容器](#在交互方式中运行容器)
        - [后台方式运行 Docker 容器](#后台方式运行-docker-容器)
        - [容器生命周期](#容器生命周期)
        - [使用 Dockerfile 构建 Docker 镜像](#使用-dockerfile-构建-docker-镜像)
        - [使用两个链接在一起的容器运行 WordPress 博客程序](#使用两个链接在一起的容器运行-wordpress-博客程序)
        - [备份在容器中运行的数据库](#备份在容器中运行的数据库)
        - [在宿主机和容器之间共享数据](#在宿主机和容器之间共享数据)
        - [在容器间共享数据](#在容器间共享数据)
        - [对容器进行数据复制](#对容器进行数据复制)
    - [创建和共享镜像](#创建和共享镜像)
        - [将对容器的修改提交到镜像](#将对容器的修改提交到镜像)
        - [将镜像和容器保存为 tar 文件进行共享](#将镜像和容器保存为-tar-文件进行共享)
        - [编写第一个 Dockerfile](#编写第一个-dockerfile)
        - [将 Flask 应用打包到镜像](#将-flask-应用打包到镜像)
        - [根据最佳实践优化 Dockerfile](#根据最佳实践优化-dockerfile)
        - [通过标签对镜像进行版本管理](#通过标签对镜像进行版本管理)
        - [使用 ONBUILD 镜像](#使用-onbuild-镜像)
    - [Docker 网络](#docker-网络)
        - [查看容器的 IP 地址](#查看容器的-ip-地址)
            - [Example 1](#example-1)
            - [Example 2](#example-2)
            - [Example 3](#example-3)
        - [将容器端口暴露到主机上](#将容器端口暴露到主机上)
    - [在 Docker 中进行容器链接](#在-docker-中进行容器链接)

<!-- /TOC -->

# Docker 笔记

## 安装方式

1. [官方安装方式](https://docs.docker.com/install/linux/docker-ce/debian/)

2. 省事方法，生产环境不建议使用

```bash
curl -fsSL get.docker.com -o get-docker.sh
```

## 基本操作

### 在交互方式中运行容器

```bash
docker run -t -i ubuntu:18.04
```

### 后台方式运行 Docker 容器

```bash
docker run -d ...
```

再次进入已运行容器

```bash
docker exec -t -i [容器ID] /bin/bash
```

> [官方文档](https://docs.docker.com/engine/reference/run/)

### 容器生命周期

**create**

创建一个新容器

```bash
docker create -P --expose=1234 python:2.7 python -m SimpleHTTPServer 1234
```

**start**

启动容器

```bash
docker start 容器id
```

**restart**

重启容器

```bash
docker restart 容器id
```

**stop**

停止正在运行的容器，这个命令会发送 `SIGTERM` 到容器，如果在一定时间内容器还没有停止，则会再发送 `SIGKILL` 信号强制停止

```bash
docker stop 容器id
```

**kill**

停止正在运行的容器，这个命令会发送 `SIGKILL` 信号强制停止

```bash
docker kill 容器id
```

**rm**

移除容器

```bash
docker rm 容器id
```

批量移除容器

```bash
docker rm $(docker ps -a -q)
```

### 使用 Dockerfile 构建 Docker 镜像

```Dockerfile
FROM busybox

ENV foo=bar
```

创建一个名为 busybox2 镜像

```shell
docker build -t busybox2
```

> [官方文档](https://docs.docker.com/engine/reference/builder/)

### 使用两个链接在一起的容器运行 WordPress 博客程序

拉取 mysql 和 wordpress 镜像

```shell
docker pull wordpress:latest

docker pull mysql:latest
```

启动 mysql 容器并设置密码，`--name` 为容器指定名称，`-d` 为后台运行

```shell
docker run --name mysqlwp -e MYSQL_ROOT_PASSWORD=110119 -d mysql
```

启动 worpress 容器，并通过 `--link` 连接 mysql 容器

```shell
docker run --name wordpress --link mysqlwp:mysql -p 80:80 -d wordpress
```

为 wordpress 创建数据库，并为其创建一个用户

```shell
docker run --name mysqlwp -e MYSQL_ROOT_PASSWORD=test123456 \ 
                            -e MYSQL_DATABASE=wordpress \ 
                            -e MYSQL_USER=wordpress \ 
                            -e MYSQL_PASSWORD=wordpresspwd \ 
                            -d mysql

```

启动 wordpress 容器

```shell
docker run --name wordpress --link mysqlwp:mysql -p 80:80 \
                            -e WORDPRESS_DB_NAME=wordpress \ 
                            -e WORDPRESS_DB_USER=wordpress \ 
                            -e WORDPRESS_DB_PASSWORD=wordpresspwd \ 
                            -d wordpress
```

删除所有容器，通过 `-v` 删除 mysql 镜像中定义的数据卷

```shell
docker stop $(docker ps -q) 
docker rm -v $(docker ps -aq)
```

### 备份在容器中运行的数据库

* 将 Docker 主机上的卷挂载到 MySQL 容器中
* 使用 `docker exec` 命令执行 `mysqldump`

```shell
docker run --name mysqlwp -e MYSQL_ROOT_PASSWORD=wordpressdocker \ 
                            -e MYSQL_DATABASE=wordpress \ 
                            -e MYSQL_USER=wordpress \ 
                            -e MYSQL_PASSWORD=wordpresspwd \
                            -v /home/docker/mysql:/var/lib/mysql \ 
                            -d mysql
```

```shell
docker exec mysqlwp mysqldump --all-databases \ 
                                --password=wordpressdocker > wordpress.backup
```

### 在宿主机和容器之间共享数据

通过 `-v` 参数将宿主机的卷挂载到容器中

```bash
docker run -ti -v /home/think/Downloads:/test ubuntu:18.04 /bin/bash
```

或者

```bash
docker run -ti -v "$PWD":/test ubuntu:18.04 /bin/bash
```

默认情况下是以读写方式挂载，如果想要以只读方式挂载数据卷，可在卷名后面后通过冒号设置相应的权限。

```bash
docker run -ti -v "$PWD":/test:ro ubuntu:18.04 /bin/bash
```

可通过 `docker inspect` 命令来查看数据卷的挂载映射情况。

```bash
docker inspect -f {{.Mounts}} 44d71a605b5b
```

> [官方文档](https://docs.docker.com/storage/volumes/)

### 在容器间共享数据

使用 `docker run` 命令的 `-v` 选项，省略宿主机中的路径，就可以创建一个称为 **数据容器** 的容器。

```bash
docker run -ti -v /test ubuntu:18.04 /bin/bash
```

可通过 `docker inspect` 命令查看数据卷位于宿主机位置

```
docker inspect -f {{.Mounts}} 0e41a4ca8172
```

重新创建一个数据卷

```bash
docker run -v /data --name data ubuntu:18.04
```

> 即使没有运行，映射关系仍然存在

通过 `` 来挂载

```bash
run -ti --volumes-from data ubuntu:18.04 /bin/bash
```

> 可以通过  `docker rm -v data` 来删除容器和它的卷

### 对容器进行数据复制

将文件复制到宿主机上

```bash
docker cp fddb12a17fbc:/data/test.txt test.txt
```

将文件从宿主机复制到容器内

```bash
docker cp cpop.txt fddb12a17fbc:/data/cpop.txt
```

## 创建和共享镜像

### 将对容器的修改提交到镜像

```bash
docker commit 62152c27b520 ubuntu:update
```

通过 `docker diff` 来查看在容器中对镜像作出的修改

```bash
docker diff 62152c27b520
```

> [`docker commit` 参考手册](https://docs.docker.com/engine/reference/commandline/commit/)

> [`docker diff` 参考手册](https://docs.docker.com/engine/reference/commandline/diff/)

### 将镜像和容器保存为 tar 文件进行共享

```bash
# 导出
docker export 7defac5eb46b > update.tar

# 导入
docker import - update < update.tar
```

```bash
# 导出
docker save -o ubuntu.tar update

# 导入
docker load < ubuntu.tar
```

> [`docker import` 参考手册](https://docs.docker.com/engine/reference/commandline/import/)

> [`docker export` 参考手册](https://docs.docker.com/engine/reference/commandline/export/)

> [`docker save` 参考手册](https://docs.docker.com/engine/reference/commandline/save/)

> [`docker load` 参考手册](https://docs.docker.com/engine/reference/commandline/load/)

### 编写第一个 Dockerfile

**`ENTRYPOINT`**

```Dockerfile
FROM ubuntu:18.10

ENTRYPOINT [ "/bin/echo" ]
```

构建

```bash
docker build .
```

运行

```bash
docker run 2c7eba9e4d01 Hi Docker!
```

**`CMD`**

```Dockerfile
FROM ubuntu:18.10

CMD [ "/bin/echo","Hi Docker!" ]
```

构建

```bash
docker build .
```

运行

```bash
docker run 31d49d5907fc
```

可以覆盖命令

```bash
docker run 31d49d5907fc /bin/date
```

1. `ENTRYPOINT` 表示镜像在初始化时需要执行的命令，不可被重写覆盖；
2. `CMD` 表示镜像运行默认参数，可被重写覆盖；
3. `ENTRYPOINT`/`CMD` 都只能在文件中存在一次，并且最后一个生效，多个存在，只有最后一个生效，其它无效！
4. 需要初始化运行多个命令，彼此之间可以使用 `&&` 隔开。

> [Dockerfile 参考](https://docs.docker.com/engine/reference/builder/)

### 将 Flask 应用打包到镜像

```python
#!/usr/bin/env python

from flask import Flask

app = Flask(__name__)


@app.route('/hi')
def hello():
    return 'Hello World！'


if __name__ == '__main__':
    app.run(port=5000)
```

```Dockerfile
FROM ubuntu:18.04

RUN apt update
RUN apt install -y python3
RUN apt install -y python3-pip
RUN python3 -m pip install flask

ADD test.py /home/test.py

EXPOSE 5000

CMD [ "python3","/home/test.py" ]  
```

构建镜像

```bash
docker build -t flask .
```

启动容器

```bash
docker run -d -P flask
```

### 根据最佳实践优化 Dockerfile

1. 在每个容器中只运行一个进程；

2. 不要以为你的容器将会长久存在：它们是临时的，会被停止和重新启动。你应该把它们当作不可变的实体，这意味着你不应该对其进行修改，而应从基础镜像重新创建它们。因此，需要将运行时配置和数据独立于容器和镜像进行管理。

3. 使用 .dockerignore 文件；

4. 利用 Docker Hub 的官方镜像，而不是自己从头编写；

5. 最大限度地减少镜像层的数量，并利用镜像缓存的优点。

[Dockerfile 最佳实践官方文档](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

### 通过标签对镜像进行版本管理

```bash
# docker source[:tag] target[:tag]
docker ubuntu:18.04 test 1.0
```

### 使用 ONBUILD 镜像

在一个 Dockerfile 文件中加上 `ONBUILD` 指令，该指令对利用该 Dockerfile 构建镜像（例如为A镜像）不会产生实质性影响。但是当编写一个新的 Dockerfile 文件来基于A镜像构建一个镜像（例如为B镜像）时，这时构造A镜像的 Dockerfile 文件中的 `ONBUILD` 指令就生效了，在构建B镜像的过程中，首先会执行 `ONBUILD` 指令指定的指令，然后才会执行其它指令。如果是再利用B镜像构造新的镜像时，那个 `ONBUILD` 指令就无效了，也就是说只能再构建子镜像中执行，对孙子镜像构建无效。

利用 `ONBUILD` 指令，实际上就是相当于创建一个模板镜像，后续可以根据该模板镜像创建特定的子镜像，需要在子镜像构建过程中执行的一些通用操作就可以在模板镜像对应的 dockerfile 文件中用 `ONBUILD` 指令指定，从而减少 dockerfile 文件的重复内容编写。

```dockerfile
FROM node:0.12.6

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ONBUILD COPY package.json /usr/src/app
ONBUILD RUN npm install
ONBUILD COPY . /usr/src/app

CMD [ "npm","start" ]
```

[ONBUILD 文档](https://docs.docker.com/engine/reference/builder/#onbuild)

## Docker 网络

### 查看容器的 IP 地址

#### Example 1

```bash
# 使用 docker inspect 命令
docker inspect --format '{{.NetworkSettings.IPAddress}}' nginx
```

#### Example 2

```bash
# 执行 ip add 命令获取
docker exec -ti nginx ip add | grep global
```

#### Example 3

```bash
# 查看 /etc/hosts 文件
docker exec -ti nginx cat /etc/host | grep nginx
```

### 将容器端口暴露到主机上

通过 `-P` 选项将容器内的端口动态绑定到宿主机上；也可以通过 `-p` 选项手动指定映射关系。

```bash
docker run -d -p 5000 --name foobar flask

# 或者 Dockerfile 中写入
docker run -d -P flask
```

可以通过 `docker port` 来查看端口映射信息

```bash
docker port foobar 5000
```

可以选择协议

```bash
docker run -d -p 5000/tcp -p 53/udp flask
```

## 在 Docker 中进行容器链接

`--link` 已废弃，使用 [桥接网络](https://docs.docker.com/network/bridge/)