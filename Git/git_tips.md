# Git 一些小技巧

## 为 Git 设置代理

**设置全局代理**

```
git config --global http.proxy http://127.0.0.1:1080
git config --global https.proxy https://127.0.0.1:1080
```

**为某个域名设置代理**

```
git config --global http.https://github.com.proxy socks5://127.0.0.1:1086
git config --global https.https://github.com.proxy socks5://127.0.0.1:1086
```

**取消设置**

```
git config --global --unset http.proxy
git config --global --unset https.proxy
```