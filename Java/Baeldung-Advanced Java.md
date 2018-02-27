### #网络接口

#### 1. 检索网络接口

```java
NetworkInterface nif = NetworkInterface.getByName("lo");

byte[] ip = new byte[] { 127, 0, 0, 1 };
NetworkInterface nif = NetworkInterface.getByInetAddress(InetAddress.getByAddress(ip));

NetworkInterface nif = NetworkInterface.getByInetAddress(InetAddress.getByName("localhost"));

NetworkInterface nif = NetworkInterface.getByInetAddress(InetAddress.getLocalHost());

NetworkInterface nif = NetworkInterface.getByInetAddress(InetAddress.getLoopbackAddress());

// java7
NetworkInterface nif = NetworkInterface.getByIndex(int index);

Enumeration<NetworkInterface> nets = NetworkInterface.getNetworkInterfaces();
for (NetworkInterface nif: Collections.list(nets)) {
    //do something with the network interface
}
```

#### 2. 网络接口参数

获取 ip 地址

```java
NetworkInterface nif = NetworkInterface.getByName("lo");
Enumeration<InetAddress> addressEnum = nif.getInetAddresses();
InetAddress address = addressEnum.nextElement();

assertEquals("127.0.0.1", address.getHostAddress());
```

通过 `getInterfaceAddresses()` 获取 `InterfaceAddress` 实例列表

```java
NetworkInterface nif = NetworkInterface.getByName("lo");
List<InterfaceAddress> addresses = nif.getInterfaceAddresses();
InterfaceAddress address = addresses.get(0);

InetAddress localAddress = address.getAddress();
InetAddress broadCastAddress = address.getBroadcast();

assertEquals("127.0.0.1", localAddress.getHostAddress());
assertEquals("127.255.255.255", broadCastAddress.getHostAddress());
```