# Spring IoC 依赖注入

## 依赖注入模式

### 手动方式

- XML 配置元信息
- Java 注解配置元信息
- API 配置元信息

### 自动方式

#### 自动绑定（Autowiring）模式

模式    | 说明
--- |   ---
模式    |   默认值，需要手动指定依赖注入对象
byName  |   根据被注入属性的名称作为 Bean 名称进行依赖查找，并将对象设置到该属性。  
byType  |   根据被注入属性的类型作为依赖类型进行查找，并将对象设置到该属性。
constructor |   特殊 byType 类型，用于构造器参数。

#### 自动绑定的限制和不足

[官方文档](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#beans-autowired-exceptions)

## 依赖注入类型

依赖注入类型    |   配置元数据
--- |   ---
setter  |   `<property name="user" ref="userBean>`
构造器  |   `<constructor-arg name="user" ref="userBean">`
字段    |   `@Autowired User user;`
方法    |   `@Autowired public void user(User user) {...}`
接口回调    |   `class MyBean implements BeanFactoryAware {...}`

### setter

- 手动模式
    - XML 资源配置元信息
    - Java 注解配置元信息
    - API 配置元信息
- 自动模式
    - byName
    - byType

### 构造器

- 手动模式
    - XML 资源配置元信息
    - Java 注解配置元信息
    - API 配置元信息
- 自动模式
    - constructor

### 字段

- `@Autowired`
- `@Resource`
- `@Inject` (JSR-330 可选)

### 方法

- `@Autowired`
- `@Resource`
- `@Bean`
- `@Inject` (JSR-330 可选)

### 接口回调

內建接口    |   接口
--- |   ---
BeanFactoryAware    |   获取 IoC 容器 - `BeanFactory`
ApplicationContextAware |   获取 Spring 应用上下文 - `ApplicationContext` 对象
EnvironmentAware    |   获取 `Environment` 对象
ResourceLoaderAware |   获取资源加载器 对象 - `ResourceLoader`
BeanClassLoaderAware    |   获取加载当前 Bean Class 的 `ClassLoader`
BeanNameAware   |   获取当前 `Bean` 的名称
MessageSourceAware  |   获取 `MessageSource` 对象，用于 Spring 国际化
ApplicationEventPublisherAware  |   获取 `ApplicationEventPublishAware` 对象，用于 Spring 事件
EmbeddedValueResolverAware  |   获取 `StringValueResolver` 对象，用于占位符处理

### 依赖注入类型选择

- 低依赖:构造器注入
- 多依赖:Setter 方法注入
- 便利性:字段注入
- 声明类:方法注入

## 限定注入

使用注解 `@Qualifier` 通过 Bean 名称进行限定，还可以进行分组

## 延迟依赖注入

`ObjectFactory` 和 `ObjectProvider` 都可以实现延迟注入，推荐使用 `ObjectProvider`

## 依赖处理过程

### 处理 `@Autowired` 注解

#### 字段注入

```java
@Autowired
private User user;
```

```txt
org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor#postProcessMergedBeanDefinition

org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor#postProcessProperties

org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor.AutowiredFieldElement#inject

org.springframework.beans.factory.support.DefaultListableBeanFactory#resolveDependency

org.springframework.beans.factory.support.DefaultListableBeanFactory#doResolveDependency

org.springframework.beans.factory.support.DefaultListableBeanFactory#determineAutowireCandidate

org.springframework.beans.factory.config.DependencyDescriptor#resolveCandidate
```

#### `Map` 注入

```java
@Autowired
private Map<String,User> userMap;
```

```txt
org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor#postProcessMergedBeanDefinition

org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor#postProcessProperties

org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor.AutowiredFieldElement#inject

org.springframework.beans.factory.support.DefaultListableBeanFactory#resolveDependency

org.springframework.beans.factory.support.DefaultListableBeanFactory#doResolveDependency

org.springframework.beans.factory.support.DefaultListableBeanFactory#resolveMultipleBeans
```

### 处理 JSR-330 `@Inject` 注解

```txt
org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor#AutowiredAnnotationBeanPostProcessor
```

## 通用注解注入原理

- 注入注解
    - `javax.xml.ws.WebServiceRef`
    - `javax.ejb.EJB`
    - `javax.annotation.Resource`
- 生命周期注解
    - `javax.annotation.PostConstruct`
    - `javax.annotation.PreDestroy`

```txt
(包含生命周期的处理)
org.springframework.context.annotation.CommonAnnotationBeanPostProcessor#postProcessMergedBeanDefinition

org.springframework.context.annotation.CommonAnnotationBeanPostProcessor#postProcessProperties

org.springframework.context.annotation.CommonAnnotationBeanPostProcessor#findResourceMetadata
(支持更多通用注解)
org.springframework.context.annotation.CommonAnnotationBeanPostProcessor#buildResourceMetadata
```

## 自定义依赖注入注解

- 基于 `AutowiredAnnotationBeanPostProcessor` 实现
- 自定义实现
    - 生命周期处理
        - `InstantiationAwareBeanPostProcessor`
        - `MergedBeanDefinitionPostProcessor` 
    - 元数据
        - `InjectedElement`
        - `InjectionMetadata`

```java
@Bean(name = AUTOWIRED_ANNOTATION_PROCESSOR_BEAN_NAME)
public static AutowiredAnnotationBeanPostProcessor beanPostProcessor() {
    AutowiredAnnotationBeanPostProcessor beanPostProcessor = new AutowiredAnnotationBeanPostProcessor();

    Set<Class<? extends Annotation>> injectAnnotation = new LinkedHashSet<>();
    injectAnnotation.add(Autowired.class);
    injectAnnotation.add(Value.class);
    injectAnnotation.add(InjectedUser.class);
    beanPostProcessor.setAutowiredAnnotationTypes(injectAnnotation);

    return beanPostProcessor;
}
```

加 `static` 提前实例化 [官方文档](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Bean.html)
