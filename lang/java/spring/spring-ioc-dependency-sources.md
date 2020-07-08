# Spring IoC 依赖来源

## 依赖查找来源

### 查找来源

来源    |  配置元数据
--- |   ---
Spring BeanDefinition   |   `<bean id="user" class="org.geekbang...User">`<br>`@Bean public User user(){...}`<br>`BeanDefinitionBuilder`
单例对象    |    API 实现

### Spring 內建 `BeanDefintion`

Bean 名称   |   Bean 实例   |   使用场景
--- |   --- |   ---
`org.springframework.contex t.annotation.internalConfigurationAnnotationProcessor` |   `ConfigurationClassPostProcessor` 对象  |   处理 Spring 配置类
`org.springframework.contex t.annotation.internalAutowiredAnnotationProcessor`  |   `AutowiredAnnotationBeanPostProcessor` 对象 |   处理 `@Autowired` 以及 `@Value` 注解
`org.springframework.contex t.annotation.internalCommonAnnotationProcessor` |   `CommonAnnotationBeanPostProcessor` 对象    |   (条件激活)处理 JSR-250 注解， 如 `@PostConstruct` 等
`org.springframework.contex t.event.internalEventListenerProcessor` |   `EventListenerMethodProcessor` 对象 |   处理标注 `@EventListener` 的 Spring 事件监听方法

### Spring 内建单例对象

Bean 名称   |   Bean 实例   |   使用场景
--- |   --- |   ---
environment |   `Environment` 对象  |   外部化配置以及 Profiles
systemProperties    |   `java.util.Properties` 对象 |   Java 系统属性
systemEnvironment   |   `java.util.Map` 对象    |   操作系统环境变量
messageSource   |   `MessageSource` 对象    |   国际化文案
lifecycleProcessor  |   `LifecycleProcessor` 对象   |   Lifecycle Bean 处理器
applicationEventPublisher   |   `ApplicationEventPublisher` 对象    |   Spring 事件广播器

```txt
org.springframework.context.annotation.AnnotationConfigUtils#registerAnnotationConfigProcessors(org.springframework.beans.factory.support.BeanDefinitionRegistry, java.lang.Object)

org.springframework.context.support.AbstractApplicationContext#prepareBeanFactory
```

## 依赖注入的来源

来源    |   配置元数据
--- |   ---
Spring BeanDefinition   |   `<bean id="user" class="org.geekbang...User">`<br>`@Bean public User user(){...}`<br>`BeanDefinitionBuilder`
单例对象    |   API 实现
非 Spring 容器管理对象  |   

```txt
org.springframework.context.support.AbstractApplicationContext#refresh

org.springframework.context.support.AbstractApplicationContext#prepareBeanFactory
```

## Spring 容器管理和游离对象

来源    |   Spring Bean 对象    |   生命周期管理    |   配置元信息  |   使用场景
--- |   --- |   --- |   --- |   ---
Spring BeanDefinition   |   是  |   是  |   有  |   依赖查找、依赖注入
单体对象    |   是  |   否  |   无  |   依赖查找、依赖注入
Resolvable Dependency   |   否  |   否  |   无  |   依赖注入

### Spring BeanDefinition 作为依赖来源

- 元数据:`BeanDefinition`
- 注册:`BeanDefinitionRegistry#registerBeanDefinition`
- 类型:延迟和非延迟
- 顺序:Bean 生命周期顺序按照注册顺序

### 单例对象作为依赖来源

要素：

- 来源:外部普通 Java 对象(不一定是 POJO)
- 注册:`SingletonBeanRegistry#registerSingleton`

限制：

- 无生命周期管理
- 无法实现延迟初始化 Bean

### 非 Spring 容器管理对象作为依赖来源

要素:

- 注册:`ConfigurableListableBeanFactory#registerResolvableDependency`

限制:

- 无生命周期管理
- 无法实现延迟初始化 Bean • 无法通过依赖查找

### 外部化配置作为依赖来源

要素:

- 类型:非常规 Spring 对象依赖来源

限制:

- 无生命周期管理
- 无法实现延迟初始化 Bean
- 无法通过依赖查找
