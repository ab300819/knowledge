# Spring IoC

## 依赖注入三种方式

###  **一、属性注入**

1. xml 配置方式

```java
public class HelloWorld {

    private String message;

    public void setMessage(String message) {
        this.message = message;
    }

    public void printMessage() {
        System.out.println(message);
    }
}
```

配置文件

```XML
<bean id="helloWorld" class="com.erercise.test.HelloWorld">
    <property name="message" value="Hello World!"/>
</bean>
```

2. 注解方式

```java
public class HelloWorld {

    @Value("Test Hello World!")
    private String message;

    public void printMessage() {
        System.out.println(message);
    }
}
```

注解文件
```java
@Configuration
public class AppConfig {

    @Bean
    public HelloWorld helloWorld() {
        return new HelloWorld();
    }
}
```

### 二、接口注入

1. xml 配置方式

```java
public interface Axel {
    String chop();
}

public class StoneAxel implements Axel {

    @Override
    public String chop() {
        return "这斧头好难用！";
    }
}
```

```java
public interface Person {
    void useAxel();
}

public class Chinese implements Person {

    private Axel axel;

    public void setAxel(Axel axel) {
        this.axel = axel;
    }
    
    @Override
    public void useAxel() {
        System.out.println(axel.chop());
    }
}
```

配置文件
```xml
<bean id="chinese" class="com.erercise.test.Chinese">
    <property name="axel" ref="stoneAxel"/>
</bean>
<bean id="stoneAxel" class="com.erercise.test.StoneAxel">

</bean>
```

2. 注解方式

```java
public interface Axel {
    String chop();
}

public class StoneAxel implements Axel {
    public String chop() {
        return "这斧头好难用！";
    }
}

public interface Person {
    void useAxel();
}

public class Chinese implements Person {

    @Autowired
    private Axel axel;
    
    @Override
    public void useAxel() {
        System.out.println(axel.chop());
    }
}
```

注解文件

```java
@Configuration
public class AppConfig {

    @Bean
    public HelloWorld helloWorld() {
        return new HelloWorld();
    }

    @Bean
    public Chinese chinese() {
        return new Chinese();
    }

    @Bean
    public StoneAxel stoneAxel() {
        return new StoneAxel();
    }
}
```

### 三、构造方法注入

1. xml 配置方式

```java
public class Chinese implements Person {

    private Axel axel;

    public Chinese(Axel axel) {
        this.axel = axel;
    }

    @Override
    public void useAxel() {
        System.out.println(axel.chop());
    }
}
```

配置文件 

```xml
<bean id="chinese" class="com.erercise.test.Chinese">
    <constructor-arg ref="stoneAxel"/>
</bean>
```

## `Spring Bbean` 配置三种方式

### 一、 xml 配置

1. `bean` 配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="hello" class="Hello"/>

</beans>
```

2. `main` 方法
```java
ApplicationContext ac = new ClassPathXmlApplicationContext("spring-config.xml");
Hello hello = (Hello) ac.getBean("hello");
hello.sayHello();
```

### 二、 基于注解配置

```java
@Scope("prototype")   
@Lazy(true)   
@Component("loginUserDao")   
public class LoginUserDao {   

    // 用于设置初始化方法   
    @PostConstruct  
    public void myInit() {   

    }   

    // 用于设置销毁方法   
    @PreDestroy  
    public void myDestroy() {   
    }   
}   
```



### 三、 Java类配置

1. 配置类

```java
@Configuration
public class Configure {

    @Bean
    public Hello hello() {
        return new Hello();
    }

}
```

2. `main` 方法

```java
ApplicationContext ac = new AnnotationConfigApplicationContext();
Hello hello = ac.getBean(Hello.class);
hello.sayHello();
```

---

## 装配 Bean

### Spring Bean 配置方案

* 在 *XML* 中进行显式配置
* 在 *Java* 中进行显式配置
* 隐式的 *Bean* 发现机制和自动装配

### #自动化装配 *Bean*

* 组件扫描
* 自动装配

#### ##创建可发现 *Bean* 并自动扫描

* `@Component` 标注一个普通的 Spring Bean 类（可以指定 *Bean* 名称，未指定时默认为小写字母开头的类名）
> `@Named('bean名称')` 是 Java 依赖注入规范提供的注解，有一些细微的差异，但是大多数场景可以相互替换。但是 `@Component` 语义更明确
* `@Controller` 标注一个控制器类
* `@Service` 标注一个业务逻辑类
* `@Repository` 标注一个DAO类

**在 Java 中配置自动扫描**

```java
@Configuration 
@ComponentScan 
public class BeanConfig {

}
```

* `@ComponentScan("soundsystem")`
* `@ComponentScan(basePackages="soundsystem")`
* `@ComponentScan(basePackages={"soundsystem", "video"})`
* `@ComponentScan(basePackageClasses={CDPlayer.class, DVDPlayer.class})` 这些类所在的包将会作为组件扫描的基础包

**在 XML 中配置自动扫描**

```xml
<context:component-scan base-package="soundsystem" />
```

#### ##实现自动装配

* 使用 `@Autowired` 进行自动装配
* 使用 `@Autowired(required = false)` 在没有匹配的 bean 的时候，会使这个 bean 处于未装配状态
* `@Inject` 属于 Java 依赖注入规范，也能用来自动装配；和 `@Autowired` 有一些细微的区别，但是大多数场景可以互换使用

### #通过 Java 代码装配 *Bean*

