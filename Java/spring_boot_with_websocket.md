# Spring Boot With Websocket

## `@MessageMapping` 向服务器发送消息

单客户端向服务器发送消息后，`AbstractMethodMessageHandler#handleMatch` 会拦截并处理请求。

```java
protected void handleMatch(T mapping, HandlerMethod handlerMethod, String lookupDestination, Message<?> message) {
    // 省略日志代码
    handlerMethod = handlerMethod.createWithResolvedBean();
    InvocableHandlerMethod invocable = new InvocableHandlerMethod(handlerMethod);
    if (this.handlerMethodLogger != null) {
        invocable.setLogger(this.handlerMethodLogger);
    }
    invocable.setMessageMethodArgumentResolvers(this.argumentResolvers);
    try {
        // 实际处理 controller 加 @MessageMapping 处理方法
        Object returnValue = invocable.invoke(message);
        MethodParameter returnType = handlerMethod.getReturnType();
        if (void.class == returnType.getParameterType()) {
            return;
        }
        if (returnValue != null && this.returnValueHandlers.isAsyncReturnValue(returnValue, returnType)) {
            ListenableFuture<?> future = this.returnValueHandlers.toListenableFuture(returnValue, returnType);
            if (future != null) {
                future.addCallback(new ReturnValueListenableFutureCallback(invocable, message));
            }
        } else {
            // 调用 HandlerMethodReturnValueHandlerComposite#handleReturnValue 来处理返回值
            this.returnValueHandlers.handleReturnValue(returnValue, returnType, message);
        }
    }

    // 省略异常捕捉
}
```

`HandlerMethodReturnValueHandlerComposite#handleReturnValue` 方法最终会调用 `SendToMethodReturnValueHandler#handleReturnValue` 进行处理。

## `@SendTo` 广播

```java
@MessageMapping("/send")
@SendTo("/topic/replay")
public MessageDto getAndSenMessage(MessageDto messageDto) {
    return new MessageDto();
}
```

~~返回值会被广播到 `/topic/replay` 这个订阅路径中；Spring 处理消息的主要类是 `SimpleBrokerMessageHandler`，当发送广播时会调用其中 `sendMessageToSubscribers` 方法。~~

## `@SendToUser` 点对点

## 传递参数

1. 在消息头中加参数

```js
stompClient.send("/app/hello", { test: "greetings" }, name);
```

在 Java 代码中可通过 `@Header` 或 `@Headers` 注解获取

```java
@Controller
public class ChatController {

	@Autowired
	private SimpMessagingTemplate template;

	@MessageMapping("/hello")
    public String send(String message,
            @Header("test") String topic,
			@Headers Map<String, Object> headers) {

		System.out.println("message==" + message);
		System.out.println("topic==" + topic);
		System.out.println("headers==" + headers);

		template.convertAndSend("/topic/" + topic, message);
		return "";
	}
}
```

2. 在路径中添加参数

```js
stompClient.send("/app/hello/aty/greetings", {}, name);
```

使用 `@DestinationVariable` 进行接受

```java
@Controller
public class Chat2Controller {
	@Autowired
	private SimpMessagingTemplate template;

	// 如果只有一个模板变量,那么可以直接使用@DestinationVariable
	@MessageMapping("/hello/{userName}/{topic}")
    public String send(String message,
        @DestinationVariable("topic") String topic,
        @DestinationVariable(value="userName") String userName) {
		System.out.println("message=="+message);
		System.out.println("topic=="+topic);
		System.out.println("userName=="+userName);

		template.convertAndSend("/topic/"+topic, message);
		return "";
	}
}
```

## 获取 `HttpSession`

注册一个握手拦截器 `HttpSessionHandshakeInterceptor`,内部的 `beforeHandshake` 方法在握手之前将 `Session` 已进行保存。

```java
public boolean beforeHandshake(ServerHttpRequest request,
        ServerHttpResponse response,
        WebSocketHandler wsHandler,
        Map<String, Object> attributes) throws Exception {

    HttpSession session = getSession(request);
    if (session != null) {
        if (isCopyHttpSessionId()) {
            attributes.put(HTTP_SESSION_ID_ATTR_NAME, session.getId());
        }
        Enumeration<String> names = session.getAttributeNames();
        while (names.hasMoreElements()) {
            String name = names.nextElement();
            if (isCopyAllAttributes() || getAttributeNames().contains(name)) {
                attributes.put(name, session.getAttribute(name));
            }
        }
    }
    return true;
}
```

可通过注入 `SimpMessageHeaderAccessor` 获取相关参数。

```java
@MessageMapping("/chat")
public void chat(SimpMessageHeaderAccessor headerAccessor, @RequestBody ChatMessage chatMessage) {
    User user = (User) headerAccessor.getSessionAttributes().get("user");  // right
    chatService.chat(user,chatMessage);
}
```
