# Spring 循环依赖

Spring Context 在初始化时会加载所有的 Bean ，使用构造器注入时会出现循环依赖问题。

1. 重新设计类（出现循环依赖本质上是类设计有问题）

2. 使用 `@Lazy`

3. 使用 Setter 或属性注入

4. 使用 `@PostConstruct`

5. 实现 `ApplicationContextAware` 获取 Bean 容器，手动获取 Bean

[参考](https://www.baeldung.com/circular-dependencies-in-spring)