# Git Tips

## 为 Git 设置代理

### 设置全局代理

```shell
git config --global http.proxy http://127.0.0.1:1080
git config --global https.proxy https://127.0.0.1:1080
```

### 为某个域名设置代理

```shell
git config --global http.https://github.com.proxy socks5://127.0.0.1:1086
git config --global https.https://github.com.proxy socks5://127.0.0.1:1086
```

### 取消设置

```shell
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## Github Markdown 扩展使用

### 使用 Latex 公式

```shell
http://latex.codecogs.com/gif.latex?\\frac{1}{1+sin(x)}
```

![image](<http://latex.codecogs.com/gif.latex?\frac{1}{1+sin(x)}>)

### 使用 UML 图

```shell
http://yuml.me/diagram/scruffy/class/[User]
```

![image](http://yuml.me/diagram/scruffy/class/[User])
