# Spring 结构

![image](../resources/spring_overview.png)

* `spring-core` 和 `spring-beans` 模块提供了框架的基本部分，包括 IoC 和依赖注入功能
* `spring-context` 模块建立在 *Core* 和 *Beans* 模块提供的可靠基础之上：它是一种类似于JNDI注册的框架式访问对象的方式。
* `spring-expression` 提供 Spring 表达式语言（Spring Expression Language， SpEL）
* `spring-aop` 提供切面编程方式
* `spring-aspects` 提供了与AspectJ的集成。
* `spring-instrument` 提供了在特定服务器中使用 class instrumentation 支持和 classloader 实现
* `spring-messaging` 提供消息模块
* `spring-jdbc` 提供 JDBC 抽象层
* `spring-tx` 支持对实现特殊接口和所有POJO（Plain Old Java Objects）的类进行编程式和声明式事务管理。
* `spring-orm` 为流行的对象关系映射 API 提供了集成层
* `spring-oxm` 提供支持 Object/XML 映射实现的抽象层

GroupId |   ArtifactId  |   Description
--- |---    |   ---
`org.springframework` |   `spring-aop`  |   Proxy-based AOP support
`org.springframework` |   `spring-aspects`  |   AspectJ based aspects
`org.springframework` |   `spring-beans`    |   Beans support, including Groovy
`org.springframework` |   `spring-context`  |   Application context runtime, including scheduling and remoting abstractions
`org.springframework` |   `spring-context-support`  |   Support classes for integrating common third-party libraries into a Spring application context  
`org.springframework` |   `spring-core` |   Core utilities, used by many other Spring modules
`org.springframework` |   `spring-expression`   |   Spring Expression Language (SpEL)
`org.springframework` |   `spring-instrument`   |   Instrumentation agent for JVM bootstrapping
`org.springframework` |   `spring-instrument-tomcat`    |   Instrumentation agent for Tomcat
`org.springframework` |   `spring-jdbc` |   JDBC support package, including DataSource setup and JDBC access support
`org.springframework` |   `spring-jms`  |   JMS support package, including helper classes to send/receive JMS messages
`org.springframework` |   `spring-messaging`    |   Support for messaging architectures and protocols
`org.springframework` |   `spring-orm`  |   Object/Relational Mapping, including JPA and Hibernate support
`org.springframework` |   `spring-oxm`  |   Object/XML Mapping
`org.springframework` |   `spring-test` |   Support for unit testing and integration testing Spring components
`org.springframework` |   `spring-tx`   |   Transaction infrastructure, including DAO support and JCA integration
`org.springframework` |   `spring-web`  |   Foundational web support, including web client and web-based remoting 
`org.springframework` |   `spring-webmvc`   |   HTTP-based Model-View-Controller and REST endpoints for Servlet stacks
`org.springframework` |   `spring-webmvc-portlet`   |   MVC implementation to be used in a Portlet environment
`org.springframework` |   `spring-websocket`    |   WebSocket and SockJS infrastructure, including STOMP messaging support