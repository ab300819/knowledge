# Spring MVC 处理请求过程

## `HttpServletBean` 

`HttpServletBean` 主要参与了创建工作，并没有涉及请求的处理。

## `FrameworkServlet`

在 `HttpServlet` 的 `service` 方法中根据请求的类型不同将请求路由到了 `doGet`、`doHead`、`doPost`、`doPut`、`doDelete`、`doOptions` 和 `doTrace` 七个方法，并且做了 `doHead`、`doOptions` 和 `doTrace` 的默认实现，其中 `doHead` 调用 `doGet`，然后返回只有 `header` 没有 `body` 的 `response`。

在 `FrameworkServlet` 中重写了 `service`、`doGet`、`doPost`、`doPut`、`doDelete`、`doOptions`、`doTrace` 方法（除了 `doHead` 的所有处理请求的方法。方法）。在 `service` 方法中增加了对 `PATCH` 类型请求的处理，其他类型的请求直接交给了父类进行处理；`doOptions` 和 `doTrace` 方法可以通过设置 `dispatchOptionsRequest` 和 `dispatchTraceRequest` 参数决定是自己处理还是交给父类处理（默认都是交给父类处理，`doOptions` 会在父类的处理结果中增加 `PATCH` 类型）。

以 `GET` 请求为例

```
get request -> FrameworkServlet(service) -> 判断是不是 patch 请求：不是 -> HttpServlet(service) -> 判断是什么类型：get -> HttpServlet(doGet)-> doGet 被子类重写 -> FrameworkServlet(doGet) -> FrameworkServlet(processRequest)
```

在 `FrameworkServlet` 中会统一调用  `processRequest` 方法处理各种请求。

```java

```
