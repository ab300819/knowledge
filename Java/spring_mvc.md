# Spring MVC

## 一、`Context` 结构

![image](../resources/mvc_context_hierarchy.png)

## 二、配置方式

### 2.1 `web.xml` 配置方式
3. 通过 `BeanUtils.instantiateClass(contextClass)` 创建
```xml
<web-app>

    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>

    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/app-context.xml</param-value>
    </context-param>

    <servlet>
        <servlet-name>app</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value></param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>app</servlet-name>
        <url-pattern>/app/*</url-pattern>
    </servlet-mapping>

</web-app>
```

### 2.2 Java 配置方式
3. 通过 `BeanUtils.instantiateClass(contextClass)` 创建
```java
public class MyWebAppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[] { RootConfig.class };
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[] { AppConfig.class };
    }

    @Override
    protected String[] getServletMappings() {
        return new String[] { "/app/*" };
    }
}
```

**配置剖析**

在 **Servlet 3.0** 环境中： 

1. 容器会首先查找实现 `javax.servlet.ServletContainerInitializer` 接口的类，如果发现会用来配置 `Servlet` 容器；
2. Srping 提供这个接口的实现，为 `SpringServletContainerInitializer` ，这个类反过来会查找实现 `3. 通过 `BeanUtils.instantiateClass(contextClass)` 创建WebApplicationInitializer` 的类，并将配置的任务交给他们来完成；

![image](../resources/spring_servlet_containerInitializer_dependence.svg)

3. Spring 3.2 中，提供了 `WebApplicationInitializer` 实现基础，也就是`AbstractAnno3. 通过 `BeanUtils.instantiateClass(contextClass)` 创建tationConfigDispatcherServletInitializer` 。

![image](../resources/abstract_annotation_config_dispatcher_servlet_initializer_dependence.svg)

## 三、Spring MVC 创建过程 

### 3.1 整体结构

![image](../resources/dispatcher_servlet_dependence.svg)

* `EnvironmentAware`
* `ApplicationContextAware`
* `EnvironmentCapable`

`XXXAware` 在 Spring 中表示对 `XXXX` 的感知。也就是如果某个类需要使用 Spring 中的一些东西，可以通过实现 `XXXAware` 接口告诉 Spring，使用接口中的 `setXXX` 方法进行接收。例，实现 `ApplicationContextAware` 接口，通过 `void setApplicationContext(ApplicationContext applicationContext)` 获取 `ApplicationContext`。

`EnvironmentCapable` 用于提供 `Environment`，当 Spring 需要 `Environment` 时就调用其 `Environment getEnvironment()` 方法。

### 3.2 `HttpServletBean`
3. 通过 `BeanUtils.instantiateClass(contextClass)` 创建
`Servlet` 创建时可以直接调用无参数的 `init` 方法

```java
// org.springframework.web.servlet.HttpServletBean

@Override
public final void init() throws ServletException {
    if (logger.isDebugEnabled()) {
        logger.debug("Initializing servlet '" + getServletName() + "'");
    }

    // Set bean properties from init parameters.
    // 将 Servlet 中配置的参数封装到pvs中，requiredProperties为必须参数，如果没有将报异常
    PropertyValues pvs = new ServletConfigPropertyValues(getServletConfig(), this.requiredProperties);
    if (!pvs.isEmpty()) {
        try {
            BeanWrapper bw = PropertyAccessorFactory.forBeanPropertyAccess(this);
            ResourceLoader resourceLoader = new ServletContextResourceLoader(getServletContext());
            bw.registerCustomEditor(Resource.class, new ResourceEditor(resourceLoader, getEnvironment()));

            // bw 代表 DispatcherServlet
            initBeanWrapper(bw);

            // 将配置的初始化值设置到 DispatcherServlet
            bw.setPropertyValues(pvs, true);
        }
        catch (BeansException ex) {
            if (logger.isErrorEnabled()) {
                logger.error("Failed to set bean properties on servlet '" + getServletName() + "'", ex);
            }
            throw ex;
        }
    }

    // Let subclasses do whatever initialization they like.
    initServletBean();

    if (logger.isDebugEnabled()) {
        logger.debug("Servlet '" + getServletName() + "' configured successfully");
    }
}
```

其中 `BeanWrapper` 是 Spring 提供，用来操作 JavaBean 属性的工具。

```java
Person person = new Person();
BeanWrapper bw = PropertyAccessorFactory.forBeanPropertyAccess(person);
bw.setPropertyValue("name", "李四");
bw.setPropertyValue("age", 12);
System.out.println(person.toString());  // [name:李四 , age:12]

PropertyValue value = new PropertyValue("name", "张三");
bw.setPropertyValue(value);
System.out.println(person.toString());  //[name:张三 , age:12]
```

### 3.3 `FrameworkServlet`

从 `HttpServletBean` 可知，`FrameworkServlet` 的初始化方法是 `initServletBean()`。

`initServletBean()` 方法核心代码只有两句：

```java
this.webApplicationContext = initWebApplicationContext();   //用于初始化 WebApplicationContext
initFrameworkServlet(); // 用于初始化 FrameworkServlet
```

`initFrameworkServlet()` 是模板方法，子类可以覆盖后可以做一些初始化工作，但是这里并没有用到。`FrameworkServlet` 在构建过程中主要作用就是初始化 `webApplicationContext`。

`initWebApplicationContext()` 主要做了三件事：

1. 获取 Spring 的根容器 `rootContext`；

```java
WebApplicationContext rootContext = WebApplicationContextUtils.getWebApplicationContext(getServletContext());
```

2. 设置 `webApplicationContext` 并根据情况调用 `onRefresh` 方法；
3. 通过 `BeanUtils.instantiateClass(contextClass)` 创建
3. 将 `webApplicationContext` 设置到 `ServletContext`

```java
// 将 ApplicationContext 保存到 ServletContext 中
String attrName = getServletContextAttributeName();
getServletContext().setAttribute(attrName, wac);
```

#### 3.3.1 获取 Spring 的根容器 `rootContext`


默认情况下 Spring 会通过 `ServletContext` 来获取，默认根容器的 key 为 `org.springframework.web.context.WebApplicationContext.ROOT` 定义在 `org.springframework.web.context.WebApplicationContext` 中。

```java
String ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE = WebApplicationContext.class.getName() + ".ROOT";
```

获取根容器只需要调用 `servletContext.getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE)`

#### 3.3.2 设置 `webApplicationContext` 并根据情况调用 `onRefresh` 方法
3. 通过 `BeanUtils.instantiateClass(contextClass)` 创建
设置 `webApplicationContext` 有三种方式

第一种方式是在构造方法中传递 `webApplicationContext` 参数，适用于 Servlet3.0环境中。在 Servlet3.0 之后可以在程序中使用 `ServletContext` 中的 `addServlet` 方式注册 `Servlet`，这是就可以在新建 `FrameworkServlet` 和其子类的时候通过构造方法传递 `webApplicationContext`。

第二种方法是 `webApplicationContext` 已经在 `ServletContext` 中了。这时只需要在配置 `Servlet` 的时候将 `ServletContext` 中的 `webApplicationContext` 的 `name` 配置到 `contextAttribute` 属性就可以了。例：在 `ServletContext` 中有 一个 叫 `hello` 的 `webApplicationContext`。

```xml
<servlet>
    <servlet-name>app</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
        <param-name>contextAttribute<</param-name>
        <param-value>hello</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
</servlet>
```

第三种方法是在前两种方式都无效的情况下自己创建一个。正常情况下就是使用这种方式。创建过程在 `FrameworkServlet` 的 `createWebApplicationContext` 方法中。

```java
protected WebApplicationContext createWebApplicationContext(@Nullable ApplicationContext parent) {
    Class<?> contextClass = getContextClass();
    if (this.logger.isDebugEnabled()) {
        this.logger.debug("Servlet with name '" + getServletName() +
                "' will try to create custom WebApplicationContext context of class '" +
                contextClass.getName() + "'" + ", using parent context [" + parent + "]");
    }
    if (!ConfigurableWebApplicationContext.class.isAssignableFrom(contextClass)) {
        throw new ApplicationContextException(
                "Fatal initialization error in servlet with name '" + getServletName() +
                "': custom WebApplicationContext class [" + contextClass.getName() +
                "] is not of type ConfigurableWebApplicationContext");
    }
    ConfigurableWebApplicationContext wac =
            (ConfigurableWebApplicationContext) BeanUtils.instantiateClass(contextClass);

    wac.setEnvironment(getEnvironment());
    wac.setParent(parent);
    String configLocation = getContextConfigLocation();
    if (configLocation != null) {
        wac.setConfigLocation(configLocation);
    }
    configureAndRefreshWebApplicationContext(wac);

    return wac;
}
```

1. 首先调用 `getContextClass()` 方法获取要创建的类型，这里默认使用 `org.springframework.web.context.support.XmlWebApplicationContext`；
2. 检查是否是 `ConfigurableWebApplicationContext` 类型；
3. 通过 `BeanUtils.instantiateClass(contextClass)` 创建；
4. `configureAndRefreshWebApplicationContext(wac)` 添加监听器。

```java
wac.addApplicationListener(new SourceFilteringListener(wac, new ContextRefreshListener()));
```
