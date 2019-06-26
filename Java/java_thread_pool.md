# Java Thread Pool

## `ThreadPoolExecutor` 构造方法参数

```java
public ThreadPoolExecutor(int corePoolSize,
                            int maximumPoolSize,
                            long keepAliveTime,
                            TimeUnit unit,
                            BlockingQueue<Runnable> workQueue,
                            ThreadFactory threadFactory,
                            RejectedExecutionHandler handler)
```

* `corePoolSize` 该线程池中核心线程数最大值
线程池新建线程的时候，如果当前线程总数小于 `corePoolSize` ，则新建的是核心线程；如果超过 `corePoolSize`，则新建的是非核心线程。
核心线程默认情况下会一直存活在线程池中，即使这个核心线程啥也不干(闲置状态)。
如果指定 `ThreadPoolExecutor` 的 `allowCoreThreadTimeOut` 这个属性为 `true`，那么核心线程如果不干活(闲置状态)的话，超过一定时间( `keepAliveTime` )，就会被销毁掉。

* `maximumPoolSize` 线程池的最大线程数
线程总数 = 核心线程数 + 非核心线程数

* `keepAliveTime` 线程池中非核心线程闲置超时时长

> 注意：一个非核心线程，如果不干活(闲置状态)的时长，超过这个参数所设定的时长，就会被销毁掉。但是，如果设置了  `allowCoreThreadTimeOut = true`，则会作用于核心线程

* `unit` 时间单位
* `workQueue` 用来储存等待执行任务的队列
* `threadFactory` 线程工厂
* `handler` 拒绝策略
主要用来抛异常，当线程无法执行新任务时（一般是由于线程池中的线程数量已经达到最大数或者线程池关闭导致的），默认情况下，当线程池无法处理新线程时，会抛出一个 `RejectedExecutionException`。

### 线程池大小

* 线程池有两个线程数的设置，一个为核心池线程数，一个为最大线程数
* 在创建了线程池后，默认情况下，线程池中并没有任何线程，等到有任务来才创建线程去执行任务，除非调用了 `prestartAllCoreThreads()` 或者 `prestartCoreThread()` 方法  
* 当创建的线程数等于 `corePoolSize` 时，会加入设置的阻塞队列。当队列满时，会创建线程执行任务直到线程池中的数量等于 `maximumPoolSize`

### 适当的阻塞队列

方法    |   抛出异常    |   返回特殊值  |   一直阻塞    |   超时退出
:---    |   :---    |   :---    |   :---    |   :---
插入方法    |   `add(e)`|   `offer(e)`| `put(e)`    |   `offer(e,time,unit)`
移除方法    |   `remove()`  |   `poll()`    |   `take()`    |   `poll(time,unit)`
检查方法    |   `element()` |   `peek()`    |   不可用  |   不可用

* `ArrayBlockingQueue`（数组阻塞队列） 一个由数组结构组成的有界阻塞队列。
* `LinkedBlockingQueue`（链表阻塞队列） 一个由链表结构组成的有界阻塞队列。
* `PriorityBlockingQueue` 一个支持优先级排序的无界阻塞队列。
* `DelayQueue`（延迟队列） 一个使用优先级队列实现的无界阻塞队列。
* `SynchronousQueue`（同步队列） 一个不存储元素的阻塞队列。
* `LinkedTransferQueue` 一个由链表结构组成的无界阻塞队列。
* `LinkedBlockingDeque` 一个由链表结构组成的双向阻塞队列。

### 明确拒绝策略

* `ThreadPoolExecutor.AbortPolicy` 丢弃任务并抛出 `RejectedExecutionException` 异常。 (默认)
* `ThreadPoolExecutor.DiscardPolicy` 也是丢弃任务，但是不抛出异常。
* `ThreadPoolExecutor.DiscardOldestPolicy` 丢弃队列最前面的任务，然后重新尝试执行任务（重复此过程）
* `ThreadPoolExecutor.CallerRunsPolicy` 由调用线程处理该任务

### `Executors` 提供的4种线程池

```java
/**
 * 1.创建一个可重用固定线程数的线程池，以共享的无界队列方式来运行这些线程，超出的线程会在队列中等待
 * 2.在任何时候，有最多  nThreads（就是我们传入参数的数量）的线程将处理任务
 * 3.如果所有线程都处于活动状态时，提交额外的任务，他们会在队列中等待，直到有一个线程可用
 * 4.如果在执行过程中出现故障，任何线程都会终止。如果需要执行后续任务，新的任务将取代它的位置。线程池中的线程会一直存在，直到它显式为止（调用shutdown）
 * 5.nThreads 就是传入线程池的数量，当 nThreads <= 0 就会抛异常 IllegalArgumentException
 */
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>());
}

public static ExecutorService newFixedThreadPool(int nThreads, ThreadFactory threadFactory) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>(),
                                threadFactory);
}

/**
 * 1.创建一个可缓存线程池，如果线程池长度超过处理需要，可灵活回收空闲线程，若无可回收，则新建线程
 * 2.这个线程池通常会提高性能去执行许多短期异步任务的程序
 * 3.如果有可用线程，当线程池调用 execute， 将重用之前的构造函数
 * 4.如果没有现有的线程可用，那么就创建新的线程并添加到池中
 * 5.线程没有使用60秒的时间被终止并从线程池里移除缓存
 */
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                60L, TimeUnit.SECONDS,
                                new SynchronousQueue<Runnable>());
}

public static ExecutorService newCachedThreadPool(ThreadFactory threadFactory) {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                60L, TimeUnit.SECONDS,
                                new SynchronousQueue<Runnable>(),
                                threadFactory);
}

/**
 * 1.创建一个单线程的线程池，它只会用唯一的工作线程来执行任务，保证所有任务按照指定顺序(FIFO, LIFO, 优先级)执行
 * 2.创建一个线程执行器，它使用单个运行中的线程操作在一个无界队列中
 * 3.如果这个单独的线程终止是因为在执行前异常或者终止，若需要执行后续的任务，那么就需要一个新的去替代它
 * 4.任务被保证按顺序的执行，并且在任何给定的时间内不超过一个任务将是活动的
 */
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService(new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}

public static ExecutorService newSingleThreadExecutor(ThreadFactory threadFactory) {
    return new FinalizableDelegatedExecutorService(new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>(),
                                threadFactory));
}

// 创建一个定长线程池，它可安排在给定延迟后运行命令或者定期地执行
public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
    return new ScheduledThreadPoolExecutor(corePoolSize);
}

public static ScheduledExecutorService newScheduledThreadPool(
    int corePoolSize, ThreadFactory threadFactory) {
    return new ScheduledThreadPoolExecutor(corePoolSize, threadFactory);
}
```

>【强制】线程池不允许使用 `Executors` 去创建，而是通过 `ThreadPoolExecutor` 的方式，
这样的处理方式让写的同学更加明确线程池的运行规则，规避资源耗尽的风险。（阿里巴巴java开发手册）

## `Runnable` 和 `Callable`

### `Runnable`

1. 实现该接口并重写run方法
2. 利用该类的对象创建线程
3. 线程启动时就会自动调用该对象的 `run` 方法

```java
ExecutorService executor = Executors.newCachedThreadPool();
executor.execute(new Runnable() { 
    public void run() {
            //TODO
    }
});

    // 使用 submit() 也可以提交 Runable ，但是会返回 Future
```

相对于继承 `Thread` 来创建线程方式，使用 `Runnable` 可以让你的实现类同时实现多个接口，而相对于 `Callable` 及 `Future` ， `Runnable` 方法并不返回任务执行结果且不能抛出异常。

### `Callable`

与 `Runnable` 不同， `Callable` 是个泛型参数化接口，并能返回线程的执行结果，且能在无法正常计算时抛出异常   

1. `Callable` 并不像 `Runnable` 那样通过 `Thread` 的 `start` 方法就能启动实现类的 `run` 方法，所以它通常利用 `ExecutorService` 的 `submit` 方法去启动call方法自执行任务，而 `ExecutorService` 的 `submit` 又返回一个 `Future` 类型的结果，因此 `Callable` 通常也与 `Future` 一起使用

```java
ExecutorService pool = Executors.newCachedThreadPool();
Future<String> future = pool.submit(new Callable{
    public void call(){
            //TODO
    }
});
```

或者利用FutureTask封装Callable再由Thread去启动（少用）

```java
FutureTask<String> task = new FutureTask(new Callable{
        public void call(){
            //TODO
        }
});

Thead thread = new Thread(task);
thread.start();
```

2. 通过 `Executors.callbale(Runnable task,T result)` 可以执行 `Runnable` 并返回"结果"，但是这个结果并不是 `Runnable` 的执行结果( `Runnable` 的 `run` 方法是 `void` 类型)，而是执行者预定义的结果，这点可以从其实现原理 `RunnableAdpter` 源码看出

```java
public static <T> Callable<T> callable(Runnable task, T result) {
    if (task == null)
        throw new NullPointerException();
    return new RunnableAdapter<T>(task, result);//通过RunnableAdapter实现
}

static final class RunnableAdapter<T> implements Callable<T> {
    final Runnable task;
    final T result;
    RunnableAdapter(Runnable task, T result) {
            this.task = task;
            this.result = result;
    }
    public T call() {
        task.run();
        return result; //将传入的结果的直接返回
    }
}
```

`Runnable` 与 `Callable` 不同点：
1. `Runnable` 不返回任务执行结果，`Callable` 可返回任务执行结果
2. `Callable` 在任务无法计算结果时抛出异常，而 `Runnable` 不能
3. `Runnable` 任务可直接由 `Thread` 的 `start` 方法或`ExecutorService` 的 `submit` 方法去执行

### ##`Future`
1. 获取任务的结果，判断任务是否完成，中断任务
2. `Future` 的 `get` 方法很好的替代的了 `Thread.join()` 或 `Thread.join(long millis)`
3. `Future`的 `get` 方法可以判断程序代码(任务)的执行是否超时

### ##`FutureTask`
`FutureTask` 实现了 `RunnableFuture` 接口，提供了即可以使用 `Runnable` 来执行任务，又可以使用 `Future` 执行任务并取得结果的构造器，所以可以利用 `FutureTask` 去封装 `Runnable` 或 `Callable` 对象，之后再 `submit` 任务

## #线程安全的集合

### ##高效的映射表、集合和队列

`java.util.concurrent` 包提供了映射表、有序集和队列， `ConcurrentHashMap` 、 `ConcurrentSkipListMap` 、 `ConcurrentSkipListSet` 、 `ConcurrentLinkedQueue`

### ##较早的线程安全集合
1. `Vector` 和 `Hashtable` 已被弃用
2. 使用同步包装器

```java
List<String> syncArryList= Collections.synchronizedList(new ArrayList<>());
Map<String,Integer> syncHashMap=Collections.synchronizedMap(new HashMap<>());
```

3. 使用新的安全集合。其中经常被修改的数组列表，使用 `ArrayList` 可以胜过 `CopyOnWriteArrayList`