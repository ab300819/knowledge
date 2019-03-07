<!-- TOC -->

- [Spring AOP](#spring-aop)
  - [一、Spring AOP 原理总结](#一spring-aop-原理总结)
    - [动态代理](#动态代理)
    - [原理对比](#原理对比)
    - [AOP 术语](#aop-术语)
    - [AOP 的动态代理](#aop-的动态代理)
  - [二、Spring AOP 的使用](#二spring-aop-的使用)
    - [2.1 切点](#21-切点)
    - [2.2 使用注解创建切面](#22-使用注解创建切面)
      - [2.2.1 定义切面](#221-定义切面)
      - [2.2.2 创建环绕通知](#222-创建环绕通知)
      - [2.2.3 处理通知中参数](#223-处理通知中参数)
      - [2.2.4 通过注解引入新功能](#224-通过注解引入新功能)
    - [2.3 在 XML 中声明切面](#23-在-xml-中声明切面)

<!-- /TOC -->

# Spring AOP

**这种在运行时，动态地将代码切入到类的指定方法、指定位置上的编程思想就是面向切面的编程**

## 一、Spring AOP 原理总结

### 动态代理

- **JDK 动态代理**：只能为接口创建动态代理实例，而不能针对类 。
- **CGLib（Code Generation Library）动态代理**：可以为任何类创建织入横切逻辑代理对象，主要是对指定的类生成一个子类，覆盖其中的方法，因为是继承，所以该类或方法最好不要声明成 `final`。

### 原理对比

- **JDK 动态代理**：JDK 动态代理技术。通过需要代理的目标类的 `getClass().getInterfaces()` 方法获取到接口信息（这里实际上是使用了 Java 反射技术。 `getClass()` 和 `getInterfaces()` 函数都在 Class 类中，Class 对象描述的是一个正在运行期间的 Java 对象的类和接口信息），通过读取这些代理接口信息生成一个实现了代理接口的动态代理 Class（动态生成代理类的字节码），然后通过反射机制获得动态代理类的构造函数，并利用该构造函数生成该 Class 的实例对象（`InvokeHandler` 作为构造函数的入参传递进去），在调用具体方法前调用 `InvokeHandler` 来处理。
- **CGLib 动态代理**：字节码技术。利用 asm 开源包，把代理对象类的 class 文件加载进来，通过修改其字节码生成子类来处理。采用非常底层的字节码技术，为一个类创建子类，并在子类中采用方法拦截的技术拦截所有父类方法的调用，并顺势织入横切逻辑。

### AOP 术语

- **Joinpoint（连接点）**  
  程序执行的某个特定位置：如类开始初始化前，类初始化后，类某个方法调用前。一个类或一段代码拥有一些边界性质的特定点，这些代码中的特定点就被称为“连接点”。**Spring 仅支持方法的连接点**，既仅能在方法调用前，方法调用后，方法抛出异常时等这些程序执行点进行织入增强。

- **Pointcut（切点）**  
  指定在哪些类的哪些方法上织入横切逻辑

- **Advice（增强）**  
  描述横切逻辑和方法的具体织入点（方法前、方法后、方法的两端等）

- **Target（目标对象）**  
  被 AOP 框架进行增强处理的对象。如果是动态 AOP 的框架，则对象是一个被代理的对象。

- **Introduction（引入）**  
  引入是一种特殊的增强，它为类添加一些属性和方法。这样，即使一个业务类原本没有实现某个接口，通过 AOP 的引介功能，我们可以动态的为该事务添加接口的实现逻辑，让业务类成为这个接口的实现类。

- **Weaving（织入）**
  织入是将增强添加对目标类具体连接点上的过程

- **Proxy（代理）**
  一个类被 AOP 织入增强后，就产生了一个结果类，它是融合了原类和增前逻辑的代理类。

- **Aspect（切面）**  
  将 **Pointcut** 和 **Advice** 两者组装起来。有了 **\*Aspect** 的信息，Spring 就可以利用 JDK 或 CGLib 的动态代理技术采用统一的方式为目标 Bean 创建织入切面的代理对象了

### AOP 的动态代理

Spring AOP 基于 XML 配置的 AOP 和基于 `@AspcetJ` 注解的 AOP，这两种方法虽然在配置切面时的表现方式不同，但底层都是使用动态代理技术（JDK 代理或 CGLib 代理）。

**Spring 可以继承 AspcetJ，但 AspcetJ 本身并不属于 Spring AOP 的范畴**

- **AspectJ**

AspectJ 在编译时“自动”编译得到了一个新类，这个新类增强了原有的 Hello.java 类的功能，因此 AspectJ 通常被称为编译时增强的 AOP 框架<br>
与 AspectJ 相对的还有另外一种 AOP 框架，它们不需要在编译时对目标类进行增强，而是运行时生成目标类的代理类，该代理类要么与目标类实现相同的接口，要么是目标类的子类——总之，代理类的实例可作为目标类的实例来使用。一般来说，编译时增强的 AOP 框架在性能上更有优势——因为运行时动态增强的 AOP 框架需要每次运行时都进行动态增强。

- **Spring AOP**

与 AspectJ 相同的是，Spring AOP 同样需要对目标类进行增强，也就是生成新的 AOP 代理类；与 AspectJ 不同的是，Spring AOP 无需使用任何特殊命令对 Java 源代码进行编译，它采用运行时动态地、在内存中临时生成“代理类”的方式来生成 AOP 代理。<br>
Spring 允许使用 AspectJ Annotation 用于定义方面（Aspect）、切入点（Pointcut）和增强处理（Advice），Spring 框架则可识别并根据这些 Annotation 来生成 AOP 代理。Spring 只是使用了和 AspectJ 5 一样的注解，但并没有使用 AspectJ 的编译器或者织入器（Weaver），底层依然使用的是 Spring AOP，依然是在运行时动态生成 AOP 代理，并不依赖于 AspectJ 的编译器或者织入器。<br>
简单地说，Spring 依然采用运行时生成动态代理的方式来增强目标对象，所以它不需要增加额外的编译，也不需要 AspectJ 的织入器支持；而 AspectJ 在采用编译时增强，所以 AspectJ 需要使用自己的编译器来编译 Java 文件，还需要织入器。

**CGLib 代理与 JDK 动态代理**

1. 如果目标对象实现了接口，默认情况下会采用 JDK 的动态代理实现 AOP
2. 如果目标对象实现了接口，可以强制使用 CGLIB 实现 AOP
3. 如果目标对象没有实现了接口，必须采用 CGLIB 库，Spring 会自动在 JDK 动态代理和 CGLIB 之间转换

**如何强制使用 CGLIB 实现 AOP**

1. 添加 CGLIB 库
2. 在 Spring 配置文件中加入 `<aop:aspectj-autoproxy proxy-target-class="true"/>`

**AOP 自动代理原理**

Spring 提供了自动代理机制，让容器为我们自动生成代理。在内部，Spring 使用 `BeanPostProcessor` 自动地完成这项工作。

这些基于 `BeanPostProcessor` 的自动代理创建器的实现类，将根据一些规则自动在容器实例化 Bean 时为匹配的 Bean 生成代理实例:

- 基于 Bean 配置名规则的自动代理创建器：允许为一组特定配置名的 Bean 自动创建代理实例的代理创建器，实现类为 `BeanNameAutoProxyCreator`
- 基于 **Advisor** 匹配机制的自动代理创建器：它会对容器中所有的 **Advisor** 进行扫描，自动将这些切面应用到匹配的 Bean 中（即为目标 Bean 创建代理实例），实现类为 `DefaultAdvisorAutoProxyCreator`
- 基于 Bean 中 `AspjectJ` 注解标签的自动代理创建器：为包含 `AspectJ` 注解的 Bean 自动创建代理实例，它的实现类是 `AnnotationAwareAspectJAutoProxyCreator` ，该类是 Spring 2.0 的新增类。

## 二、Spring AOP 的使用

### 2.1 切点

```java
public interface Performance {

    void perform();

}
```

- `execution(* com.exercise.demo.aspect.component.Performance.perform(..))` 执行方法时触发
- `execution(* com.exercise.demo.aspect.component.Performance.perform(int ))&&args(test)` 传入参数
- `execution(* com.exercise.demo.aspect.component.Performance.perform()) && within(com.exercise.demo.aspect.component.*)` 并且 `com.exercise.demo.aspect.component` 任意类方法被调用时

**再切点中选择*Bean***

`execution(* com.exercise.demo.aspect.component.Performance.perform()) && bean('test')`

在执行 `Performance` 的 `perform()` 方法时应用通知，但限定 _Bean_ 的 ID 为 test

### 2.2 使用注解创建切面

#### 2.2.1 定义切面

| 注解              | 通知                                     |
| ----------------- | ---------------------------------------- |
| `@After`          | 通知方法会在目标方法返回或抛出异常后调用 |
| `@AfterReturning` | 通知方法会在目标方法返回后调用           |
| `@AfterThrowing`  | 通知方法会在目标方法抛出异常后调用       |
| `@Around`         | 通知方法会将目标方法封装起来             |
| `@Before`         | 通知方法会在目标方法调用之前执行         |

```java
@Aspect
@Component
public class AspectConfig {

    private static Logger logger = LoggerFactory.getLogger(AspectConfig.class);

    @Before("execution(* com.exercise.demo.aspect.component.Animal.walk(int ))&&args(test)")
    public void silenceCellPhone(int test) {
        logger.debug("test 开始是" + test);
        logger.debug("Silencing cell phone");
    }

    @Before("execution(* com.exercise.demo.aspect.component.Animal.walk())")
    public void takeSeats() {
        logger.debug("Take seats");
    }
}
```

对于频繁使用的切点，可以通过 `@Pointcut` 注解，定义一次，然后每次需要的时候引用它

```java
@Aspect
@Component
public class AspectConfig {

    private static Logger logger = LoggerFactory.getLogger(AspectConfig.class);

    @Pointcut("execution(* com.exercise.demo.aspect.component.Performance.perform(..))")
    public void performance() {}

    @Before("performance()")
    public void silenceCellPhone() {
        logger.debug("Silencing cell phone");
    }
}
```

`performance()` 方法的实际内容并不重要，在这里它实际上应该是空的。其实该方法本身只是一个标识，供 `@Pointcut` 注解依附。<br>

上述配置是在 Spring Boot 中配置，如果使用 JavaConfig 配置

```java
@Configuration
@EnableAspectJAutoProxy
@ComponentScan
public class TotalConfig {

    @Bean
    public AspectConfig aspectConfig() {
        return new AspectConfig();
    }

}
```

使用 XML 配置

```xml
<context:component-scan base-package="com.exercise.demo.aspect.component"/>
<aop:aspectj-autoproxy/>
<bean class="com.exercise.demo.aspect.config.AspectConfig"/>
```

#### 2.2.2 创建环绕通知

```java
@Aspect
@Component
public class AspectConfig {

    private static Logger logger = LoggerFactory.getLogger(AspectConfig.class);

    @Pointcut("execution(* com.exercise.demo.aspect.component.Performance.perform(..))")
    public void performance() {
        logger.debug("定义总切点");
    }

    /**
     * 创建环绕通知
     *
     * @param jp
     * @throws Throwable
     */
    @Around("performance()")
    public void watchPerformance(ProceedingJoinPoint jp) throws Throwable {

        logger.debug("Silencing cell phones");
        logger.debug("Taking seats");
        jp.proceed();
        logger.debug("CLAP CLAP CLAP!!!");
    }
```

#### 2.2.3 处理通知中参数

```java
@Aspect
@Component
public class AspectConfig {

    private static Logger logger = LoggerFactory.getLogger(AspectConfig.class);

    @Before("execution(* com.exercise.demo.aspect.component.Animal.walk(int )) && args(test)")
    public void silenceCellPhone(int test) {
        logger.debug("test 开始是" + test);
        logger.debug("Silencing cell phone");
    }
}
```

#### 2.2.4 通过注解引入新功能

```java
@DeclareParents(
        value = "com.exercise.demo.aspect.component.Person+",
        defaultImpl = FoodImpl.class)
public static Food food;
```

`@DeclareParents` 注解由三部分组成：

- `value` 属性指定了哪种类型的 _Bean_ 要引入该接口。在本例中，也就是所有实现 `Person` 的类型。（标记符后面的 `+` 表示是 `Person` 的所有子类型，而不是 `Person` 本身。）
- `defaultImpl` 属性指定了为引入功能提供实现的类。在这里，我们指定的是 `FoodImpl` 提供实现。
  public static Food food;
- `@DeclareParents` 注解所标注的静态属性指明了要引入了接口。在这里，我们所引入的是 `Food` 接口。

### 2.3 在 XML 中声明切面

**JavaConfig 配置**

```java
@Aspect
@Component
public class AspectConfig {

    private static Logger logger = LoggerFactory.getLogger(AspectConfig.class);

    @Before("execution(* com.exercise.demo.aspect.component.Animal.walk(int ))&&args(test)")
    public void silenceCellPhone(int test) {
        logger.debug("test 开始是" + test);
        logger.debug("Silencing cell phone");
    }

    @Before("execution(* com.exercise.demo.aspect.component.Animal.walk())")
    public void takeSeats() {
        logger.debug("Take seats");
    }

    @Pointcut("execution(* com.exercise.demo.aspect.component.Performance.perform(..))")
    public void performance() {
        logger.debug("定义总切点");
    }

    /**
     * 创建环绕通知
     *
     * @param jp
     * @throws Throwable
     */
    @Around("performance()")
    public void watchPerformance(ProceedingJoinPoint jp) throws Throwable {

        logger.debug("Silencing cell phones");
        logger.debug("Taking seats");
        jp.proceed();
        logger.debug("CLAP CLAP CLAP!!!");
    }

    /**
     * 引入新功能
     */
    @DeclareParents(
            value = "com.exercise.demo.aspect.component.Person+",
            defaultImpl = FoodImpl.class)
    public static Food food;

}
```

**对应 XML 配置**

```xml
<bean id="aspectConfig" class="com.exercise.test.aspect.config.AspectConfig"/>

<aop:config>
    <aop:aspect ref="aspectConfig">
        <!--前后通知-->
        <aop:before pointcut="execution(* com.exercise.test.aspect.component.Animal.walk())"
                    method="silenceCellPhone"/>
        <aop:before method="takeSeats"
                    pointcut="execution(* com.exercise.test.aspect.component.Animal.walk())"/>

        <!--环绕通知-->
        <aop:pointcut id="performance"
                      expression="execution(* com.exercise.test.aspect.component.Performance.perform())"/>
        <aop:around method="watchPerformance"
                    pointcut-ref="performance"/>

        <!--添加新功能-->
        <aop:declare-parents types-matching="com.exercise.test.aspect.component.Person+"
                                implement-interface="com.exercise.test.aspect.component.Food"
                                default-impl="com.exercise.test.aspect.component.FoodImpl"/>
    </aop:aspect>
</aop:config>
```
