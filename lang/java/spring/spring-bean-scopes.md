# Spring Bean 作用域

## 作用域

来源    |   说明
--- |   ---
singleton |   默认 Spring Bean 作用域，一个 `BeanFactory` 有且仅有一个实例
prototype   |   原型作用域，每次依赖查找和依赖注入生成新 Bean 对象
request |   将 Spring Bean 存储在 `ServletRequest` 上下文中
session |   将 Spring Bean 存储在 `HttpSession` 中
application |   将 Spring Bean 存储在 `ServletContext` 中

## prototype Bean 作用域

Spring容器没有办法管理 prototype Bean 的完整生命周期，也没有办法记录示例的存
在。销毁回调方法将不会执行，可以利用 `BeanPostProcessor` 进行清扫工作。

```txt
org.springframework.beans.factory.config.BeanDefinition
```
