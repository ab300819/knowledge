<!-- TOC -->

- [Spring IoC](#spring-ioc)
    - [一、装配 Bean](#一装配-bean)
        - [1.1 Spring Bean 配置方案](#11-spring-bean-配置方案)
        - [1.2 自动化装配 Bean](#12-自动化装配-bean)
            - [1.2.1 创建可发现 Bean 并自动扫描](#121-创建可发现-bean-并自动扫描)
            - [1.2.2 实现自动装配](#122-实现自动装配)
        - [1.3通过 Java 代码装配 Bean](#13通过-java-代码装配-bean)
            - [1.3.1 创建配置类](#131-创建配置类)
            - [1.3.2 声明简单的 Bean](#132-声明简单的-bean)
        - [1.4通过 XML 代码装配 Bean](#14通过-xml-代码装配-bean)
            - [1.4.1 声明一个简单的 `<bean>`](#141-声明一个简单的-bean)
            - [1.4.2 借助构造器注入初始化 Bean](#142-借助构造器注入初始化-bean)
            - [1.4.3 设置属性](#143-设置属性)
            - [1.4.4 使用 `<util:*>`](#144-使用-util)
        - [1.5 混合配置](#15-混合配置)
            - [1.5.1 在 JavaConfig 中引用 XML 配置](#151-在-javaconfig-中引用-xml-配置)
            - [1.5.2 在 XML 配置中引用 JavaConfig](#152-在-xml-配置中引用-javaconfig)
    - [二、高级装配](#二高级装配)
        - [2.1 环境与 profile](#21-环境与-profile)
            - [2.1.1 配置不同环境的配置](#211-配置不同环境的配置)
                - [在 JavaConfig 中配置](#在-javaconfig-中配置)
                - [在 XML 中配置](#在-xml-中配置)
            - [2.1.2 激活配置](#212-激活配置)
        - [2.2 条件化的 Bean](#22-条件化的-bean)
        - [2.3 处理自动装配的歧义](#23-处理自动装配的歧义)
            - [2.3.1 标记首选的 Bean](#231-标记首选的-bean)
            - [2.3.2 限定自动装配的 Bean](#232-限定自动装配的-bean)
        - [2.4 *Bean* 的作用域](#24-bean-的作用域)
        - [2.5 运行时值注入](#25-运行时值注入)
            - [2.5.1 注入外部值](#251-注入外部值)
            - [2.5.2 使用 Spring 表达式语言进行装配](#252-使用-spring-表达式语言进行装配)

<!-- /TOC -->

# Spring IoC

**Spring 三种ApplicationContext**

* `AnnotationConfigApplicationContext` 通过注解配置来加载 Spring 上下文，使用方式：`ApplicationContext c = new AnnotationConfigApplicationContext(ContextConfig.class);`
* `ClassPathXmlApplicationContext` 通过 XML 加载 Spring 上下文方式：`ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");`
* `FileSystemXmlApplicationContext` 和 `ClassPathXmlApplicationContext` 非常类似，只是这里的配置文件可以位于整个文件系统中任意位置

## 一、装配 Bean

### 1.1 Spring Bean 配置方案

* 在 *XML* 中进行显式配置
* 在 *Java* 中进行显式配置
* 隐式的 *Bean* 发现机制和自动装配

### 1.2 自动化装配 Bean

* 组件扫描
* 自动装配

#### 1.2.1 创建可发现 Bean 并自动扫描

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

#### 1.2.2 实现自动装配

* 使用 `@Autowired` 进行自动装配
* 使用 `@Autowired(required = false)` 在没有匹配的 bean 的时候，会使这个 bean 处于未装配状态
* `@Inject` 属于 Java 依赖注入规范，也能用来自动装配；和 `@Autowired` 有一些细微的区别，但是大多数场景可以互换使用

### 1.3通过 Java 代码装配 Bean

#### 1.3.1 创建配置类

```java
@Configuration 
public class BeanConfig {
}
```

#### 1.3.2 声明简单的 Bean

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

### 1.4通过 XML 代码装配 Bean

#### 1.4.1 声明一个简单的 `<bean>`

```xml
<bean class="soundsystem.SgtPeppers"/>
```

> 默认 `id` 为 ``soundsystem.SgtPeppers#0`，其中 `#0` 是计数形式，用于区分同类型其他 *Bean*

指定 `id`

```xml
<bean id="compactDisc" class="soundsystem.SgtPeppers"/>
```

#### 1.4.2 借助构造器注入初始化 Bean

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

#### 1.4.3 设置属性

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

#### 1.4.4 使用 `<util:*>`

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

### 1.5 混合配置

#### 1.5.1 在 JavaConfig 中引用 XML 配置

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

#### 1.5.2 在 XML 配置中引用 JavaConfig

* 拆分 xml 配置文件，并引入
```xml
<import resource="cd-config.xml"/>
```

* 在 xml 中引入 JavaConfig
```xml
<bean class="JavaConfig"/>
```

## 二、高级装配

### 2.1 环境与 profile

#### 2.1.1 配置不同环境的配置

##### 在 JavaConfig 中配置

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

##### 在 XML 中配置

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

#### 2.1.2 激活配置

激活 *profile* 有两个属性：

* `spring.profiles.active`
* `spring.profiles.default`

如果 `spring.profiles.active` 设置值，则由其激活相应的配置，否则查找 `spring.profiles.default` 值

* 在 `web.xm` 中配置默认 *profile*
```xml
<servlet>
    <init-param>
        <param-name>spring.profiles.default</param-name>
        <param-value>dev</param-value>
    </init-param>
</servlet>

<context-param>
    <param-name>spring.profiles.default</param-name>
    <param-value>dev</param-value>
</context-param>
```

* 在单元测试中，使用 `@ActiveProfiles("dev")` 激活环境

### 2.2 条件化的 Bean

使用 `@Conditional` 注解，根据计算结果，如果是 `true` 则实例化 *Bean*，如果是 `false`，则忽略<br>

```java
@Bean
@Conditional(MagicExistsCondition.class)
public MagicBean magicBean() {
    return new MagicBean();
}
```

`@Conditional` 接受实现 `Condition` 接口的类作为参数；`Condition` 接口只有一个 `matches` 方法<br>

```java
public class MagicExistsCondition implements Condition {

    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        Environment env = context.getEnvironment();
        return env.containsProperty("magic");
    }

}
```

`ConditionContext` 接口内容

```java
public interface ConditionContext {

	BeanDefinitionRegistry getRegistry();

	ConfigurableListableBeanFactory getBeanFactory();

	Environment getEnvironment();

	ResourceLoader getResourceLoader();

    ClassLoader getClassLoader();

}
```

参数    |   作用
--- |   ---
`BeanDefinitionRegistry`  |   检查 *Bean* 定义
`ConfigurableListableBeanFactory`  |    检查是 *Bean* 是否存在，甚至探查 *Bean* 属性 
`Environment`  |    检查环境变量是否存在以及它的值 
`ResourceLoader`  |   加载的资源
`ClassLoader`  |   加载并检查类是否存在

`AnnotatedTypeMetadata` 接口内容

```java
public interface AnnotatedTypeMetadata {
    boolean isAnnotated(String var1);

    @Nullable
    Map<String, Object> getAnnotationAttributes(String var1);

    @Nullable
    Map<String, Object> getAnnotationAttributes(String var1, boolean var2);

    @Nullable
    MultiValueMap<String, Object> getAllAnnotationAttributes(String var1);

    @Nullable
    MultiValueMap<String, Object> getAllAnnotationAttributes(String var1, boolean var2);
}
```

### 2.3 处理自动装配的歧义

#### 2.3.1 标记首选的 Bean

```java
@Component 
@Primary 
public class IceCream implements Dessert { 
    ... 
}
```

```java
@Bean 
@Primary 
public Dessert iceCream() { 
    return new IceCream(); 
}
```

```xml
<bean id="iceCream" class="com.desserteater.IceCream" primary="true"/>
```

#### 2.3.2 限定自动装配的 Bean

`@Qualifier` 注解是使用限定符的主要方式，可以与 `@Autowired` 和 `@Inject` 协同使用，在注入时指定的 *Bean*

```java
@Autowired 
@Qualifier("iceCream") 
public void setDessert( Dessert dessert) { 
    this. dessert = dessert; 
}
```

**创建自定义限定符**

```java
@Component 
@Qualifier("cold") 
public class IceCream implements Dessert { 
    ... 
}
```

```java
@Bean 
@Qualifier("cold") 
public Dessert iceCream() { 
    return new IceCream(); 
}
```

**创建自定义限定符注解**

```java
@Target({
        ElementType.CONSTRUCTOR,
        ElementType.FIELD,
        ElementType.METHOD,
        ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Qualifier
public @interface Code {
}
```

使用自定义注解

```java
@Component 
@Cold 
@Creamy 
public class IceCream implements Dessert { ... }
```

```java
@Autowired 
@Cold 
@Creamy 
public void setDessert( Dessert dessert) { 
    this. dessert = dessert; 
}
```

### 2.4 *Bean* 的作用域

Spring 作用域：

* 单例（`Singleton`）：在整个应用中，只创建 `Bean` 的一个实例（默认）。
* 原型（`Prototype`）：每次注入或者通过 Spring 应用上下文获取的时候， 都会创建一个新的 `Bean` 实例。
* 会话（`Session`）：在 Web 应用中，为每个会话创建一个 `Bean` 实例。 
* 请求（`Rquest`）：在 Web 应用中，为每个请求创建一个 `Bean` 实例。

用法

```java
@Component 
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE) 
public class Notepad { ... }
```

```java
@Bean 
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE) 
public Notepad notepad() { 
    return new Notepad(); 
}
```

```xml
<bean id="notepad" class="com.myapp.Notepad" scope="prototype"/>
```

**使用会话和请求作用域**

```java
@Component 
@Scope(value = WebApplicationContext.SCOPE_SESSION, 
        proxyMode= ScopedProxyMode. INTERFACES) 
public ShoppingCart cart() { ... }
```

```java
@Component 
public class StoreService { 

    @Autowired 
    public void setShoppingCart(ShoppingCart shoppingCart) { 
        this. shoppingCart = shoppingCart; 
    } 

}
```

`WebApplicationContext.SCOPE_SESSION` 会告诉 Spring 为 web 应用中的每个会话创建一个 `ShoppingCart`，会创建多个 `ShoppingCart` *Bean* 实例，但是对于每个会话只有一个实例，相当于对于当前会话是单例的。<br>

`StoreService` *Bean* 是一个单例的 *Bean*，会在 Spring 应用上下文加载的时候创建，在它创建时，Spring 会尝试将 `ShoppingCart` 注入，但是 `ShoppingCart` *Bean* 是会话作用域，此时并不存在，直到用户进入系统，创建会话，才有 `StoreService` 实例。<br>

而且系统会存在多个 `ShoppingCart`，每个用户一个。 并不想让 Spring 注入某个固定的 `ShoppingCart` 实例到 `StoreService` 中。只希望使用的 `ShoppingCart` 实例恰好是当前会话所对应的那一个。<br>

设置 `proxyMode` 不会将实际的 `ShoppingCart` *Bean* 注入到目标中，而是注入到 `ShoppingCart` *Bean* 代理中，该代理对外暴露与 `ShoppingCart` 相同的方法。<br>

如果 `ShoppingCart` 是一个具体类，就必须使用 *CGLib* 来生成基于类的代理；需要将 `proxyMode` 设置为 `ScopedProxyMode.TARGET_CLASS`。<br>

**在 XML 中声明作用域代理**

```xml
<bean id="cart" class="com.myapp.ShoppingCart" scope="session">
    <aop:scoped-proxy/> 
</bean>
```

默认情况下，它会使用 CGLib 创建目标类的代理。 但是也可以将 `proxy-target-class` 属性设置为 `false`， 进而要求它生成基于接口的代理

### 2.5 运行时值注入

#### 2.5.1 注入外部值

```java
@Configuration
@PropertySource("classpath:app.properties")
public class ExpressiveConfig {

    @Autowired
    Environment env;

    public BlankDisc disk() {
        return new BlankDisc(env.getProperty("disc.title"), env.getProperty("disc.artist"));
    }

}
```

**Spring 的 Environment**

`Environment` 的 `getProperty()` 有四种重载形式

* `String getProperty(String key)`
* `String getProperty(String key, String defaultValue)` 当目标值不存在时 `defaultValue` 为默认值
* `T getProperty(String key, Class< T> type)`
* `T getProperty(String key, Class< T> type, T defaultValue)`

使用 `getRequiredProperty()` 目标属性必须存在，不能为空

* `containsProperty()` 判断属性是否存在
* `getPropertyAsClass()` 将属性解析为类，例：`Class<CompactDisc> cdClass = env.getPropertyAsClass("disc.class", CompactDisc.class);`

**解析属性占位符**

使用 `${...}` 包装属性名称

在 XML 配置文件中

```xml
<bean id="blankDisc" class="com.exercise.test.jms.BlankDisc" c:artist="${disc.title}" c:title="${disc.artist}"/>
```

在 JavaConfig 中

```java
public class BlankDisc {

    private String title;
    private String artist;

    public BlankDisc(@Value("${disc.artist}") String title, @Value("${disc.title}") String artist) {
        this.title = title;
        this.artist = artist;
    }
}
```

要使用占位符，需要配置 `PropertySourcesPlaceholderConfigurer` *Bean*

```java
@Bean 
public static PropertySourcesPlaceholderConfigurer placeholderConfigurer() { 
    return new PropertySourcesPlaceholderConfigurer(); 
}
```

```xml
<context:property-placeholder/>
```

#### 2.5.2 使用 Spring 表达式语言进行装配

使用 Spring 表达式语言（Spring Expression Language， SpEL），需将表达式放入 `#{...}` 中；

**表示字面值**

* `#{3.14159}` 浮点值
* `#{9.87E4}` 科学记数法
* `#{'Hello'}` 字符串
* `#{false}` 布尔值

**引用 *Bean*、属性和方法**

* `#{sgtPeppers}` *Bean* id
* `#{sgtPeppers.artist}` *Bean* 属性
* `#{artistSelector.selectArtist()}` *Bean* 方法

**表达式使用类型**

* `#{T(System).currentTimeMillis()}`
* `#{T(java.lang.Math).PI}`

**计算正则表达式**

`#{admin.email matches '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.com'}`

**计算集合**

* `#{jukebox.songs[4].title}` 其中 `jukebox` 为 *Bean* ID 
* `#{jukebox.songs[T(java.lang.Math).random()*jukebox.songs.size()].title}` 随机选择

使用查询运算符（`.?[]`），例：`#{jukebox.songs.?[artist eq 'Aerosmith']}` 得到 Aerosmith 所有歌曲<br>

`.^[]` 和 `.$[]`，用来在集合中查询第一个匹配项和最后一个匹配项<br>

`.![]` 投影运算符，会从集合的每个成员中选择特定的属性放到另外一个集合中

* `#{jukebox.songs.![title]}` 将 `title` 属性投影到一个新的 `String` 类型的集合中
* `#{jukebox.songs.?[artist eq 'Aerosmith'].![title]}` 获得 Aerosmith 所有歌曲的名称列表
