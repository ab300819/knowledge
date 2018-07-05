# Spring MVC `HandlerMapping`

## 依赖图

![image](../resources/)

## 概述

`HandlerMapping` 的作用是根据 `request` 找到相应的处理器 `Handler` 和 `Interceptors`。`HandlerMapping` 接口里面只有一个方法。

```java
@Nullable
HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception;
```
在 `DispatcherServlet` 中，查找 `Handler` 是按顺序遍历所有的 `HandlerMapping`，当找到一个 `HandlerMapping` 后立即停止查找并返回。

```java
	@Nullable
	protected HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
		if (this.handlerMappings != null) {
			for (HandlerMapping hm : this.handlerMappings) {
                
                // 省略日志代码
                
				HandlerExecutionChain handler = hm.getHandler(request);
				if (handler != null) {
					return handler;
				}
			}
		}
		return null;
	}
```

## `AbstractHandlerMapping`

### 创建 `AbstractHandlerMapping` 

