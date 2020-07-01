# Spring IoC 依赖注入


## 字段注入

```java
@Autowired
private User user;
```

```
org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor#postProcessMergedBeanDefinition

org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor#postProcessProperties

org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor.AutowiredFieldElement#inject

org.springframework.beans.factory.support.DefaultListableBeanFactory#resolveDependency

org.springframework.beans.factory.support.DefaultListableBeanFactory#doResolveDependency

org.springframework.beans.factory.support.DefaultListableBeanFactory#determineAutowireCandidate

org.springframework.beans.factory.config.DependencyDescriptor#resolveCandidate
```

## `Map` 注入区别

```java
@Autowired
private Map<String,User> userMap;
```

```
org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor#postProcessMergedBeanDefinition

org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor#postProcessProperties

org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor.AutowiredFieldElement#inject

org.springframework.beans.factory.support.DefaultListableBeanFactory#resolveDependency

org.springframework.beans.factory.support.DefaultListableBeanFactory#doResolveDependency

org.springframework.beans.factory.support.DefaultListableBeanFactory#resolveMultipleBeans
```

## 处理 JSR-330 `@Inject` 注解

```
org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor#AutowiredAnnotationBeanPostProcessor
```

## 通用注解原理

```
(包含生命周期的处理)
org.springframework.context.annotation.CommonAnnotationBeanPostProcessor#postProcessMergedBeanDefinition

org.springframework.context.annotation.CommonAnnotationBeanPostProcessor#postProcessProperties

org.springframework.context.annotation.CommonAnnotationBeanPostProcessor#findResourceMetadata
(支持更多通用注解)
org.springframework.context.annotation.CommonAnnotationBeanPostProcessor#buildResourceMetadata
```


## 自定义注解

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

