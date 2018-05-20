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

## 一、装配 Bean

### 1.1 Spring Bean 配置方案

* 在 *XML* 中进行显式配置
* 在 *Java* 中进行显式配置
* 隐式的 *Bean* 发现机制和自动装配

### #1.2 自动化装配 *Bean*

* 组件扫描
* 自动装配

#### ##1.2.1 创建可发现 *Bean* 并自动扫描

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

#### ##1.2.2 实现自动装配

* 使用 `@Autowired` 进行自动装配
* 使用 `@Autowired(required = false)` 在没有匹配的 bean 的时候，会使这个 bean 处于未装配状态
* `@Inject` 属于 Java 依赖注入规范，也能用来自动装配；和 `@Autowired` 有一些细微的区别，但是大多数场景可以互换使用

### #1.3通过 Java 代码装配 *Bean*

#### ##1.3.1 创建配置类

```java
@Configuration 
public class BeanConfig {
}
```

#### ##1.3.2 声明简单的 *Bean*

```java
@Bean 
public CompactDisc sgtPeppers() { 
    return new SgtPeppers(); 
}
```

> 该 *Bean* 默认名称就是方法名

也可以指定 *Bean* 名称

```java
@Bean(name="lonelyHeartsClubBand")
public CompactDisc sgtPeppers() { 
    return new SgtPeppers(); 
}
```

### #1.4通过 XML 代码装配 *Bean*

#### ##1.4.1 声明一个简单的 `<bean>`

```xml
<bean class="soundsystem.SgtPeppers"/>
```

> 默认 `id` 为 ``soundsystem.SgtPeppers#0`，其中 `#0` 是计数形式，用于区分同类型其他 *Bean*

指定 `id`

```xml
<bean id="compactDisc" class="soundsystem.SgtPeppers"/>
```

#### ##1.4.2 借助构造器注入初始化 *Bean*

```xml
<bean id="cdPlayer" class="soundsystem.CDPlayer"> 
    <constructor-arg ref="compactDisc"/> 
</bean>
```

> 备选使用 `c` 命名空间

**传入集合元素**

```xml
<bean id="cdPlayer" class="soundsystem.CDPlayer"> 
    <constructor-arg>
        <list>
            <value>Hello World!</value>
            <value>Test</value>
        </list>
    </constructor-arg>
</bean>
```

```xml
<bean id="cdPlayer" class="soundsystem.CDPlayer"> 
    <constructor-arg>
        <list>
            <ref bean="animalImpl"/>
            <ref bean="foodImpl"/>
            <ref bean="performanceImpl"/>
            <ref bean="personImpl"/>
        </list>
    </constructor-arg>
</bean>
```

> `set` 元素同理，但是都不能用于 `c` 命名空间 

#### ##1.4.3 设置属性

```xml
<bean id="cdPlayer" class="soundsystem.CDPlayer"> 
    <property name="compactDisc" ref="compactDisc"/> 
</bean>
```

> 备选使用 `p` 命名空间

**传入集合元素**

```xml
<bean id="cdPlayer" class="soundsystem.CDPlayer"> 
    <property name="compactDisc">
        <list>
            <value>Hello World!</value>
            <value>Test</value>
        </list>
    </property>
</bean>
```

```xml
<bean id="cdPlayer" class="soundsystem.CDPlayer"> 
    <property name="compactDisc">
        <list>
            <ref bean="animalImpl"/>
            <ref bean="foodImpl"/>
            <ref bean="performanceImpl"/>
            <ref bean="personImpl"/>
        </list>
    </property>
</bean>
```

> `set` 元素同理，但是都不能用于 `p` 命名空间 

#### ##1.4.4 使用 `<util:*>`

使用 `<util:*>` 创建单独的 *Bean*

元素    |   描述
--- |   --- 
`<util:constant>`   |   引用某个类型的 `public static` 域，并将其暴露为 *Bean* 
`<util:list>`   |   创建一个 `java.util.List` 类型的 *Bean*，其中包含值或引用 
`<util:map>`    |   创建一个 `java.util.Map` 类型 的 *Bean*，其中包含值或引用 
`<util:properties>` |   创建一个 `java.util.Properties` 类型的 *Bean* 
`<util:property-path>`  |   引用一个 *Bean* 的属性（或内嵌属性），并将其暴露为 *Bean* 
`<util:set>`    |   创建一个 `java.util.Set` 类型的 *Bean*，其中包含值或引用

```xml
<util:list id="test">
    <value>Hello World!</value>
    <value>Test</value>
</util:list>
```

### #1.5 混合配置

#### ##1.5.1 在 JavaConfig 中引用 XML 配置

* 拆分 JavaConfig 并引入
```java
@Configuration
@Import(OtherConfig.class)
public class TestConfig {
}
```

* 创建一个更高级别的 JavaConfig ，只组合 JavaConfig
```java
@Configuration
@Import({OtherConfig.class, TestConfig.class})
public class Test {
}
```

* 引入 XML 配置文件
```java
@Configuration
@Import(TestConfig.class)
@ImportResource("classpath:test-config.xml")
public class OtherConfig {
}
```

#### ##1.5.2 在 XML 配置中引用 JavaConfig

* 拆分 xml 配置文件，并引入
```xml
<import resource="cd-config.xml"/>
```

* 在 xml 中引入 JavaConfig
```xml
<bean class="JavaConfig"/>
```

## 二、高级装配

### #2.1 环境与 profile

#### ##2.1.1 配置不同环境的配置

##在 JavaConfig 中配置

* 创建不同环境的 *Configuration*，类级别
```java
@Configuration
@Profile("dev")
public class TestConfig {
    ...
}

@Configuration
@Profile("prod")
public class ProdConfig {
    ...
}
```

* 创建方法级别的配置环境
```java
@Configuration
public class TestConfig {

    @Bean
    @Profile("dev")
    public AnimalImpl devConfig(){

    }

    @Bean
    @Profile("prod")
    public Animal prod(){
        
    }
}
```

##在 XML 中配置

* 直接在 XML 根节点配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd"
        profile="dev">

    <bean id="animalImpl" class="com.exercise.test.aspect.component.AnimalImpl"/>

</beans>
```

* 嵌套 `<beans>` 进行配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <beans profile="dev">

    </beans>

    <beans profile="prod">
        
    </beans>
</beans>
```

#### ##2.1.2 激活配置

激活 *profile* 有两个属性：

* `spring.profiles.active`
* `spring.profiles.default`

如果 `spring.profiles.active` 设置值，则由其激活相应的配置，否则查找 `spring.profiles.default` 值

* 在 `web.xm` 中配置默认 *profile*
```xml

```

* 在单元测试中，使用 `@ActiveProfiles("dev")` 激活环境
