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
protected final void processRequest(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {

	long startTime = System.currentTimeMillis();
	Throwable failureCause = null;

    // 获取 LocaleContextHolder 中原来保存的 LocaleContext
    LocaleContext previousLocaleContext = LocaleContextHolder.getLocaleContext();
    // 获取当前请求的 LocaleContext
	LocaleContext localeContext = buildLocaleContext(request);

    // 获取 RequestContextHolder 中原来保存的 RequestAttributes
    RequestAttributes previousAttributes = RequestContextHolder.getRequestAttributes();
    // 获取当前请求的 ServletRequestAttributes
	ServletRequestAttributes requestAttributes = buildRequestAttributes(request, response, previousAttributes);

	WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);
	asyncManager.registerCallableInterceptor(FrameworkServlet.class.getName(), new RequestBindingInterceptor());

    // 将当前请求的 LocaleContext 和 ServletRequestAttributes 设置到 LocaleContextHolder 和 RequestContextHolder
	initContextHolders(request, localeContext, requestAttributes);

	try {
        // 实际入口
		doService(request, response);
	}
	catch (ServletException | IOException ex) {
		failureCause = ex;
		throw ex;
	}
	catch (Throwable ex) {
		failureCause = ex;
		throw new NestedServletException("Request processing failed", ex);
	}

	finally {
        // 恢复原来的 LocaleContext 和 ServletRequestAttributes 到 LocaleContextHolder 和 RequestContextHolder 中
		resetContextHolders(request, previousLocaleContext, previousAttributes);
		if (requestAttributes != null) {
			requestAttributes.requestCompleted();
		}

		if (logger.isDebugEnabled()) {
			if (failureCause != null) {
				this.logger.debug("Could not complete request", failureCause);
			}
			else {
				if (asyncManager.isConcurrentHandlingStarted()) {
					logger.debug("Leaving response open for concurrent processing");
				}
				else {
					this.logger.debug("Successfully completed request");
				}
			}
		}

        //发布 ServletRequestHandledEvent 消息
		publishRequestHandledEvent(request, response, startTime, failureCause);
	}
}
```

