# Spring Boot With Websocket

## `@SendTo` 广播

```java
@MessageMapping("/send")
@SendTo("/topic/replay")
public MessageDto getAndSenMessage(MessageDto messageDto) {
    return new MessageDto();
}
```

返回值会被广播到 `/topic/replay` 这个订阅路径中；Spring 处理消息的主要类是 `SimpleBrokerMessageHandler`，当发送广播时会调用其中 `sendMessageToSubscribers` 方法。

## `@SendToUser` 点对点
