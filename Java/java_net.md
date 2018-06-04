# Java 网络

## Internet 地址

* 根据域名获取 `InetAddress` 对象

```java
InetAddress address = InetAddress.getByName("www.baidu.com");
```

* 根据 `InetAddress` 对象获取 IP 地址字节数组

```java
byte[] addressBytes = address.getAddress();
```

可使用下面代码转化为十进制

```java
static String numericToTextFormat(byte[] src){
    return (src[0] & 0xff) + "." + (src[1] & 0xff) + "." + (src[2] & 0xff) + "." + (src[3] & 0xff);
}
```

* 使用 `getHostAddress()` 直接转化为十进制 IP 地址字符串

```java
String addressStr = address.getHostAddress();
```

* 使用 `getHostName()` 获取主机名

```java
String hostName=address.getHostName();
```

* 使用 `getLocalHost()` 获取本机 IP 地址

```java
InetAddress local = InetAddress.getLocalHost();
```

* 获取域名所有对应 `InetAddress` 对象

```java
InetAddress[] addresses = InetAddress.getAllByName("www.baidu.com");
```