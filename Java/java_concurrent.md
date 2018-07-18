<!-- TOC -->

- [Java 并发](#java-并发)
    - [线程间通信](#线程间通信)
    - [`Lock` 接口](#lock-接口)
    - [`Condition` 接口](#condition-接口)
    - [锁分类](#锁分类)
        - [公平锁/非公平锁](#公平锁非公平锁)
        - [独享锁/共享锁](#独享锁共享锁)
        - [互斥锁/读写锁](#互斥锁读写锁)
        - [乐观锁/悲观锁](#乐观锁悲观锁)
        - [偏向锁/轻量级锁/重量级锁](#偏向锁轻量级锁重量级锁)
        - [可重入锁](#可重入锁)
        - [分段锁](#分段锁)
        - [自旋锁](#自旋锁)
        - [阻塞锁](#阻塞锁)
        - [对象锁](#对象锁)
        - [锁粗化](#锁粗化)
        - [锁消除](#锁消除)
        - [锁膨胀](#锁膨胀)
        - [信号量](#信号量)
    - [死锁](#死锁)

<!-- /TOC -->

#  Java 并发

**JUC**

Java 并发包 `java.util.concurrnt`

**AQS**

抽象类 ` AbstractQueuedSynchronizer`

**CAS**

CAS（Compare and swap）比较和替换是设计并发算法时用到的一种技术。简单来说，比较和替换是使用一个期望值和一个变量的当前值进行比较，如果当前变量的值与我们期望的值相等，就使用一个新值替换当前变量的值。

## 线程间通信

* 面向字节： `PipedOutputStream、` `PipedInputStream`
* 面向字符: `PipedWriter`、 `PipedReader`

```java
public class WriteData {

	public void writeMethod(PipedOutputStream out) {
		try {
			System.out.println("write :");
			for (int i = 0; i < 300; i++) {
				String outData = "" + (i + 1);
				out.write(outData.getBytes());
				System.out.print(outData);
			}
			System.out.println();
			out.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

```java
public class ReadData {

	public void readMethod(PipedInputStream input) {
		try {
			System.out.println("read  :");
			byte[] byteArray = new byte[20];
			int readLength = input.read(byteArray);
			while (readLength != -1) {
				String newData = new String(byteArray, 0, readLength);
				System.out.print(newData);
				readLength = input.read(byteArray);
			}
			System.out.println();
			input.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

```java
public class ThreadWrite extends Thread {

	private WriteData write;
	private PipedOutputStream out;

	public ThreadWrite(WriteData write, PipedOutputStream out) {
		super();
		this.write = write;
		this.out = out;
	}

	@Override
	public void run() {
		write.writeMethod(out);
	}

}
```

```java
public class ThreadRead extends Thread {

	private ReadData read;
	private PipedInputStream input;

	public ThreadRead(ReadData read, PipedInputStream input) {
		super();
		this.read = read;
		this.input = input;
	}

	@Override
	public void run() {
		read.readMethod(input);
	}
}
```

```java
public class Run {

	public static void main(String[] args) {

		try {
			WriteData writeData = new WriteData();
			ReadData readData = new ReadData();

			PipedInputStream inputStream = new PipedInputStream();
			PipedOutputStream outputStream = new PipedOutputStream();

			// inputStream.connect(outputStream);
			outputStream.connect(inputStream);

			ThreadRead threadRead = new ThreadRead(readData, inputStream);
			threadRead.start();

			Thread.sleep(2000);

			ThreadWrite threadWrite = new ThreadWrite(writeData, outputStream);
			threadWrite.start();

		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}
```

## `Lock` 接口

`Lock` 接口有三个实现类：

* `ReentrantLock`
* `ReentrantReadWriteLock.ReadLock`
* `ReentrantReadWriteLock.WriteLock`

使用方式 

```java
Lock lock = new ReentrantLock();
lock.lock();
try{

}finally{
    lock.unlock();
}
```

> 最好不要把获取锁的过程写在try语句块中，因为如果在获取锁时发生了异常，异常抛出的同时也会导致锁无法被释放。

**ReentrantReadWriteLock**

`ReentrantReadWriteLock` 是一个读写锁：
* 在 **读** 取数据的时候，可以 **多个线程同时进入到到临界区**(被锁定的区域)
* 在 **写** 数据的时候，无论是读线程还是写线程都是 **互斥** 的

一般来说：我们大多数都是读取数据得多，修改数据得少。所以这个读写锁在这种场景下就很有用了！

总结：

* `ReentrantReadWriteLock` 和 `ReentrantLock` 都支持公平和非公平模式，公平模式下会去看FIFO队列线程是否是在队头，而非公平模式下是没有的；
* `ReentrantReadWriteLock` 是一个读写锁，如果读的线程比写的线程要多很多的话，那可以考虑使用它。它使用 `state` *的变量 **高16位是读锁，低16位是写锁**
* 写锁可以降级为读锁，读锁不能升级为写锁
* 写锁是互斥的，读锁是共享的。

## `Condition` 接口

`Condition` 接口的常见方法

方法名称    |   描述
--- |   ---
`void await()`  |   相当于 `Object` 类的 `wait` 方法
`boolean await(long time,TimeUnit unit)`    |   相当于 `Object` 类的 `wait(long timeout)` 方法
`void signal()` |   相当于 `Object` 类的 `notify` 方法
`void signalAll()`  |   相当于 `Object` 类的 `notifyAll` 方法

`Condition` 将 `Object` 监视器方法（`wait`、`notify` 和 `notifyAll`）分解成截然不同的对象，以便通过将这些对象与任意 `Lock` 实现组合使用，为每个对象提供多个等待 set（wait-set）。其中，`Lock` 替代了 `synchronized` 方法和语句的使用，`Condition` 替代了 `Object` 监视器方法的使用。 


1. 使用单个 `Condition` 实例实现等待/通知机制：

```java
public class UseSingleConditionWaitNotify {

	public static void main(String[] args) throws InterruptedException {

		MyService service = new MyService();

		ThreadA a = new ThreadA(service);
		a.start();

		Thread.sleep(3000);

		service.signal();

	}

	static public class MyService {

		private Lock lock = new ReentrantLock();
		public Condition condition = lock.newCondition();

		public void await() {
			lock.lock();
			try {
				System.out.println(" await时间为" + System.currentTimeMillis());
				condition.await();
				System.out.println("这是condition.await()方法之后的语句，condition.signal()方法之后我才被执行");
			} catch (InterruptedException e) {
				e.printStackTrace();
			} finally {
				lock.unlock();
			}
		}

		public void signal() throws InterruptedException {
			lock.lock();
			try {				
				System.out.println("signal时间为" + System.currentTimeMillis());
				condition.signal();
				Thread.sleep(3000);
				System.out.println("这是condition.signal()方法之后的语句");
			} finally {
				lock.unlock();
			}
		}
	}

	static public class ThreadA extends Thread {

		private MyService service;

		public ThreadA(MyService service) {
			super();
			this.service = service;
		}

		@Override
		public void run() {
			service.await();
		}
	}
}
```

2. 使用多个 `Condition` 实例实现等待/通知机制：

```java
public class UseMoreConditionWaitNotify {
	public static void main(String[] args) throws InterruptedException {

		MyserviceMoreCondition service = new MyserviceMoreCondition();

		ThreadA a = new ThreadA(service);
		a.setName("A");
		a.start();

		ThreadB b = new ThreadB(service);
		b.setName("B");
		b.start();

		Thread.sleep(3000);

		service.signalAll_A();

	}
	static public class ThreadA extends Thread {

		private MyserviceMoreCondition service;

		public ThreadA(MyserviceMoreCondition service) {
			super();
			this.service = service;
		}

		@Override
		public void run() {
			service.awaitA();
		}
	}
	static public class ThreadB extends Thread {

		private MyserviceMoreCondition service;

		public ThreadB(MyserviceMoreCondition service) {
			super();
			this.service = service;
		}

		@Override
		public void run() {
			service.awaitB();
		}
	}
}
```

```java
public class MyserviceMoreCondition {

	private Lock lock = new ReentrantLock();
	public Condition conditionA = lock.newCondition();
	public Condition conditionB = lock.newCondition();

	public void awaitA() {
		lock.lock();
		try {
			System.out.println("begin awaitA时间为" + System.currentTimeMillis()
					+ " ThreadName=" + Thread.currentThread().getName());
			conditionA.await();
			System.out.println("  end awaitA时间为" + System.currentTimeMillis()
					+ " ThreadName=" + Thread.currentThread().getName());
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			lock.unlock();
		}
	}

	public void awaitB() {
		lock.lock();
		try {			
			System.out.println("begin awaitB时间为" + System.currentTimeMillis()
					+ " ThreadName=" + Thread.currentThread().getName());
			conditionB.await();
			System.out.println("  end awaitB时间为" + System.currentTimeMillis()
					+ " ThreadName=" + Thread.currentThread().getName());
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			lock.unlock();
		}
	}

	public void signalAll_A() {
		lock.lock();
		try {			
			System.out.println("  signalAll_A时间为" + System.currentTimeMillis()
					+ " ThreadName=" + Thread.currentThread().getName());
			conditionA.signalAll();
		} finally {
			lock.unlock();
		}
	}

	public void signalAll_B() {
		lock.lock();
		try {		
			System.out.println("  signalAll_B时间为" + System.currentTimeMillis()
					+ " ThreadName=" + Thread.currentThread().getName());
			conditionB.signalAll();
		} finally {
			lock.unlock();
		}
	}
}
```

3. 使用 `Condition` 实现顺序执行

```java
public class ConditionSeqExec {

	volatile private static int nextPrintWho = 1;
	private static ReentrantLock lock = new ReentrantLock();
	final private static Condition conditionA = lock.newCondition();
	final private static Condition conditionB = lock.newCondition();
	final private static Condition conditionC = lock.newCondition();

	public static void main(String[] args) {

		Thread threadA = new Thread() {
			public void run() {
				try {
					lock.lock();
					while (nextPrintWho != 1) {
						conditionA.await();
					}
					for (int i = 0; i < 3; i++) {
						System.out.println("ThreadA " + (i + 1));
					}
					nextPrintWho = 2;
					//通知conditionB实例的线程运行
					conditionB.signalAll();
				} catch (InterruptedException e) {
					e.printStackTrace();
				} finally {
					lock.unlock();
				}
			}
		};

		Thread threadB = new Thread() {
			public void run() {
				try {
					lock.lock();
					while (nextPrintWho != 2) {
						conditionB.await();
					}
					for (int i = 0; i < 3; i++) {
						System.out.println("ThreadB " + (i + 1));
					}
					nextPrintWho = 3;
					//通知conditionC实例的线程运行
					conditionC.signalAll();
				} catch (InterruptedException e) {
					e.printStackTrace();
				} finally {
					lock.unlock();
				}
			}
		};

		Thread threadC = new Thread() {
			public void run() {
				try {
					lock.lock();
					while (nextPrintWho != 3) {
						conditionC.await();
					}
					for (int i = 0; i < 3; i++) {
						System.out.println("ThreadC " + (i + 1));
					}
					nextPrintWho = 1;
					//通知conditionA实例的线程运行
					conditionA.signalAll();
				} catch (InterruptedException e) {
					e.printStackTrace();
				} finally {
					lock.unlock();
				}
			}
		};
		Thread[] aArray = new Thread[5];
		Thread[] bArray = new Thread[5];
		Thread[] cArray = new Thread[5];

		for (int i = 0; i < 5; i++) {
			aArray[i] = new Thread(threadA);
			bArray[i] = new Thread(threadB);
			cArray[i] = new Thread(threadC);

			aArray[i].start();
			bArray[i].start();
			cArray[i].start();
		}
	}
}
```

## 锁分类

### 公平锁/非公平锁

* 公平锁是指多个线程按照申请锁的顺序来获取锁；
* 非公平锁是指多个线程获取锁的顺序并不是按照申请锁的顺序，有可能后申请的线程比先申请的线程优先获取锁。有可能，会造成优先级反转或者饥饿现象。

对于 `ReentrantLock` 而言，通过构造函数指定该锁是否是公平锁，默认是非公平锁。非公平锁的优点在于吞吐量比公平锁大。<br>
对于 `Synchronized` 而言，也是一种非公平锁。由于其并不像 `ReentrantLock` 是通过 *AQS* 的来实现线程调度，所以并没有任何办法使其变成公平锁。

### 独享锁/共享锁

* 独享锁是指该锁一次只能被一个线程所持有；
* 共享锁是指该锁可被多个线程所持有。

对于 `ReentrantLock` 而言，其是独享锁。但是对于 `Lock` 的另一个实现类 `ReadWriteLock` ，其读锁是共享锁，其写锁是独享锁。<br>
读锁的共享锁可保证并发读是非常高效的，读写，写读 ，写写的过程是互斥的。<br>
独享锁与共享锁也是通过AQS来实现的，通过实现不同的方法，来实现独享或者共享。
对于Synchronized而言，当然是独享锁。<br>

### 互斥锁/读写锁

独享锁/共享锁就是一种广义的说法，互斥锁/读写锁就是具体的实现。<br>

* 互斥锁在 Java 中的具体实现就是 `ReentrantLock`
* 读写锁在 Java 中的具体实现就是 `ReadWriteLock`

### 乐观锁/悲观锁

乐观锁与悲观锁不是指具体的什么类型的锁，而是指看待并发同步的角度。<br>
悲观锁认为对于同一个数据的并发操作，一定是会发生修改的，哪怕没有修改，也会认为修改。因此对于同一个数据的并发操作，悲观锁采取加锁的形式。悲观的认为，不加锁的并发操作一定会出问题。<br>
乐观锁则认为对于同一个数据的并发操作，是不会发生修改的。在更新数据的时候，会采用尝试更新，不断重新的方式更新数据。乐观的认为，不加锁的并发操作是没有事情的。<br>
悲观锁适合写操作非常多的场景，乐观锁适合读操作非常多的场景，不加锁会带来大量的性能提升。<br>
悲观锁在 Java 中的使用，就是利用各种锁。<br>
乐观锁在 Java 中的使用，是无锁编程，常常采用的是 *CAS* 算法，典型的例子就是原子类，通过 *CAS* 自旋实现原子操作的更新。

### 偏向锁/轻量级锁/重量级锁

这三种锁是指锁的状态，并且是针对 `Synchronized`。在Java 5通过引入锁升级的机制来实现高效 `Synchronized`，这三种锁的状态是通过对象监视器在对象头中的字段来表明的。<br>
偏向锁是指一段同步代码一直被一个线程所访问，那么该线程会自动获取锁，降低获取锁的代价。<br>
轻量级锁是指当锁是偏向锁的时候，被另一个线程所访问，偏向锁就会升级为轻量级锁，其他线程会通过自旋的形式尝试获取锁，不会阻塞，提高性能。<br>
重量级锁是指当锁为轻量级锁的时候，另一个线程虽然是自旋，但自旋不会一直持续下去，当自旋一定次数的时候，还没有获取到锁，就会进入阻塞，该锁膨胀为重量级锁。重量级锁会让其他申请的线程进入阻塞，性能降低。<br>

### 可重入锁

可重入锁又名递归锁，是指在同一个线程在外层方法获取锁的时候，在进入内层方法会自动获取锁。`ReentrantLock` 是一个可重入锁，`Synchronized` 也是一个可重入锁，可重入锁的一个好处是可一定程度避免死锁。

```java
synchronized void setA() throws Exception{
    Thread.sleep(1000);
    setB();
}

synchronized void setB() throws Exception{
    Thread.sleep(1000);
}
```

### 分段锁

分段锁其实是一种锁的设计，并不是具体的一种锁，对于 `ConcurrentHashMap` 而言，其并发的实现就是通过分段锁的形式来实现高效的并发操作。<br>
`ConcurrentHashMap` 中的分段锁称为 `Segment` ，它即类似于 `HashMap`（JDK7与JDK8中 `HashMap` 的实现）的结构，即内部拥有一个 `Entry` 数组，数组中的每个元素又是一个链表；同时又是一个 `ReentrantLock`（ `Segment` 继承了 `ReentrantLock`)。<br>
当需要 `put` 元素的时候，并不是对整个 `HashMap` 进行加锁，而是先通过 `hashcode` 来知道他要放在那一个分段中，然后对这个分段进行加锁，所以当多线程 `put` 的时候，只要不是放在一个分段中，就实现了真正的并行的插入。<br>
但是，在统计 `size` 的时候，可就是获取 `HashMap` 全局信息的时候，就需要获取所有的分段锁才能统计。<br>
分段锁的设计目的是细化锁的粒度，当操作不需要更新整个数组的时候，就仅仅针对数组中的一项进行加锁操作。<br>

### 自旋锁

自旋锁并不是一种锁，而是一种锁优化技术。<br>

```java
public class SpinLock {

    private AtomicReference<Thread> sign =new AtomicReference<>();

    public void lock(){
        Thread current = Thread.currentThread();
        while(!sign .compareAndSet(null, current)){
        }
    }

    public void unlock (){
        Thread current = Thread.currentThread();
        sign .compareAndSet(current, null);
    }
}
```

使用了 *CAS* 原子操作，`lock` 函数将 `current` 设置为当前线程，并且预测原来的值为空。`unlock` 函数将 `current` 设置为 `null`，并且预测值为当前线程。<br>
当有第二个线程调用 `lock` 操作时由于 `current` 值不为空，导致循环一直被执行，直至第一个线程调用 `unlock` 函数将 `current` 设置为 `null`，第二个线程才能进入临界区。<br>
由于自旋锁只是将当前线程不停地执行循环体，不进行线程状态的改变，所以响应速度更快。但当线程数不停增加时，性能下降明显，因为每个线程都需要执行，占用CPU时间。如果线程竞争不激烈，并且保持锁的时间段。适合使用自旋锁。<br>

自旋锁衍生出三种: *Ticket Spin Lock*、*CLH Spin Lock*、*MCS Spin Lock*

**Ticket Spin Lock**

为了解决 *Spin Lock* 中随机不公平的问题, 使用排队自旋锁。<br>
线程想要竞争某个锁，需要先领一张 `ticket`，然后监听 `flag`，发现 `flag` 被更新为手上的 `ticket` 的值了，才能去占领锁。<br>

```java
public class TicketSpinlock {
    private AtomicInteger ticket = new AtomicInteger();
    private AtomicInteger flag = new AtomicInteger();
    private static final ThreadLocal<Integer> LOCAL = new ThreadLocal<Integer>();

    public void lock() {
        int myTicket = ticket.getAndIncrement();    //发号必须是一个原子操作，不能多个线程拿到同一个ticket
        LOCAL.set(myTicket)
        while (myTicket != flag.get()) {
        }
    }
    // 只有持有锁的才能释放锁
    public void unlock() {
        int next = LOCAL.get() + 1;
        flag.compareAndSet(ticket, next);
    }
}
```

每次都要查询 `flag`，影响性能（必须要到主内存读取，并阻止其他cpu修改）

**CLH Spin Lock**

*CLH* （Craig, Landin, and Hagersten）减少了缓存一致性带来的开销。<br>
*CLH* 和 *MCS* 是两种类型相似的公平锁，采用链表的相似进行排序

```java
public class CLHSpinLock {

    public static class CLHNode {
        private volatile boolean isLocked = true;
    }

    @SuppressWarnings("unused")
    private volatile CLHNode tail;
    private static final ThreadLocal<CLHNode> LOCAL = new ThreadLocal<>();
    private static final AtomicReferenceFieldUpdater<CLHSpinLock, CLHNode> UPDATER =
            AtomicReferenceFieldUpdater.newUpdater(CLHSpinLock.class, CLHNode.class, "tail");

    public void lock() {
        CLHNode node = new CLHNode();
        LOCAL.set(node);
        CLHNode preNode = UPDATER.getAndSet(this, node);
        if (preNode != null) {
            while (preNode.isLocked) {
            }
            preNode = null;
            LOCAL.set(node);
        }
    }

    public void unlock() {
        CLHNode node = LOCAL.get();
        if (!UPDATER.compareAndSet(this, node, null)) {
            node.isLocked = false;
        }
        node = null;
    }
}
```

*CLH* 锁的变种被应用于 *JUC* 包下的 `AbstractQueuedSynchronizer`<br>
*CLH* 是不停的查询前驱变量， 导致不适合在 NUMA 架构下使用（在这种结构下，每个线程分布在不同的物理内存区域）

*MCS Spin Lock*

*CLH* 是在前驱节点的 `locked` 域上自旋，*MCS* 是在自己节点上的 `locked` 域上自旋。不存在 CLH* 的问题。<br>
实现思路：前驱节点在释放锁之后，会主动将后继节点的 `locked`域更新。<br>
也就是把多次对远端内存的监听 + 一次对本地内存的更新，简化成了多次对本地内存的监听 + 一次对远端内存的更新。

```java
public class MCSSpinLock {

    public static class MCSNode {
        volatile MCSNode next;
        volatile boolean isLocked = true;
    }

    private static final ThreadLocal<MCSNode> NODE = new ThreadLocal<>();
    @SuppressWarnings("unused")
    private volatile MCSNode queue;
    private static final AtomicReferenceFieldUpdater<MCSSpinLock, MCSNode> UPDATER = AtomicReferenceFieldUpdater.newUpdater(MCSSpinLock.class,
            MCSNode.class, "queue");

    public void lock() {
        MCSNode currentNode = new MCSNode();
        NODE.set(currentNode);
        MCSNode preNode = UPDATER.getAndSet(this, currentNode);
        if (preNode != null) {
            preNode.next = currentNode;
            while (currentNode.isLocked) {

            }
        }
    }

    public void unlock() {
        MCSNode currentNode = NODE.get();
        if (currentNode.next == null) {
            if (UPDATER.compareAndSet(this, currentNode, null)) {

            } else {
                while (currentNode.next == null) {
                }
            }
        } else {
            currentNode.next.isLocked = false;
            currentNode.next = null;
        }
    }
}

```

*CLH* 的队列是隐式的队列，没有真实的后继结点属性。<br>
*MCS* 的队列是显式的队列，有真实的后继结点属性。

### 阻塞锁

```java
public class CLHLock2 {

    public static class CLHNode {
        private volatile Thread isLocked;
    }

    @SuppressWarnings("unused")
    private volatile CLHNode tail;
    private static final ThreadLocal<CLHNode> LOCAL = new ThreadLocal<>();
    private static final AtomicReferenceFieldUpdater<CLHLock2, CLHNode> UPDATER = AtomicReferenceFieldUpdater.newUpdater(CLHLock2.class,
            CLHNode.class, "tail");

    public void lock() {
        CLHNode node = new CLHNode();
        LOCAL.set(node);
        CLHNode preNode = UPDATER.getAndSet(this, node);
        if (preNode != null) {
            preNode.isLocked = Thread.currentThread();
            LockSupport.park(this);
            preNode = null;
            LOCAL.set(node);
        }
    }

    public void unlock() {
        CLHNode node = LOCAL.get();
        if (!UPDATER.compareAndSet(this, node, null)) {
            System.out.println("unlock\t" + node.isLocked.getName());
            LockSupport.unpark(node.isLocked);
        }
        node = null;
    }
}
```

改变自 *CLH* 锁，使用 `LockSupport.unpark()` 的阻塞锁；<br>
阻塞锁的优势在于，阻塞的线程不会占用cpu时间， 不会导致 CPu占用率过高，但进入时间以及恢复时间都要比自旋锁略慢。<br>
在竞争激烈的情况下 阻塞锁的性能要明显高于 自旋锁。<br>
理想的情况则是; 在线程竞争不激烈的情况下，使用自旋锁，竞争激烈的情况下使用，阻塞锁。<br>

### 对象锁

1. 类锁：在代码中的方法上加了 `static` 和 `synchronized` 的锁，或者 `synchronized(xxx.class) `的代码段；
2. 对象锁：在代码中的方法上加了`synchronized` 的锁，或者 `synchronized(this)` 的代码段； 
3. 私有锁：在类内部声明一个私有属性如 `private Object lock`，在需要加锁的代码段 `synchronized(lock)`；
4. 对一个全局对象或者类加锁时，对该类的所有对象都起作用；

对一个全局对象加锁

```java
public class MySynchronized extends Thread{
    private int val;
    
    private static Object lock = new Object();
    
    public MySynchronized(int v){
        val = v;
    }
    
    public void printVal(int v){
        synchronized (lock){
            while (true){
                System.out.println(v);
            }
        }
    }
    
    public void run(){
        printVal(val);
    }
}
```

对整个类加锁

```java
public class MySynchronized extends Thread{
    private int val;
    
    public MySynchronized(int v){
        val = v;
    }
    
    public void printVal(int v){
        synchronized (MySynchronized.class){
            while (true){
                System.out.println(v);
            }
        }
    }
    
    public void run(){
        printVal(val);
    }
}
```

> 非静态方法:
> 给对象加锁(可以理解为给这个对象的内存上锁,注意 只是这块内存,其他同类对象都会有各自的内存锁),这时候
> 在其他一个以上线程中执行该对象的这个同步方法(注意:是该对象)就会产生互斥
>
> 静态方法: 
> 相当于在类上加锁(*.class 位于代码区,静态方法位于静态区域,这个类产生的对象公用这个静态方法,所以这块
> 内存，N个对象来竞争), 这时候,只要是这个类产生的对象,在调用这个静态方法时都会产生互斥

### 锁粗化

对于相邻的几个同步块，如果这些同步块使用的是同一个锁实例，那么JIT编译器会将这些同步块合并为一个大同步块，从而避免了一个线程反复申请、释放同一个锁所导致的开销。然而，锁粗化可能导致一个线程持续持有一个锁的时间变长，从而使得同步在该锁之上的其他线程在申请锁时的等待时间变长。

### 锁消除

在动态编译同步块的时候，JIT 编译器可以借助一种被称为逃逸分析（Escape Analysis）的技术来判断同步块所使用的锁对象是否只能够被一个线程访问而没有被发布到其他线程。如果同步块所使用的锁对象通过这种分析被证实只能够被一个线程访问，那么JIT编译器在编译这个同步块的时候并不生成 `synchronized` 所表示的锁的申请与释放对应的机器码，而仅生成原临界区代码对应的机器码，这就造成了被动态编译的字节码就像是不包含monitorenter（申请锁）和monitorexit（释放锁）这两个字节码指令一样，即消除了锁的使用。这种编译器优化就被称为锁消除（Lock Elision），它使得特定情况下我们可以完全消除锁的开销。

### 锁膨胀

如果一系列的连续操作都对同一个对象反复加锁和解锁，甚至加锁操作是出现在循环体中的，那即使没有线程竞争，频繁地进行互斥同步操作也会导致不必要的性能损耗。 如果虚拟机探测到有这样一串零碎的操作都对同一个对象加锁，将会把加锁同步的范围扩展（膨胀）到整个操作序列的外部（由多次加锁编程只加锁一次）。

### 信号量

`Semaphore` 是用来保护一个或者多个共享资源的访问，`Semaphore` 内部维护了一个计数器，其值为可以访问的共享资源的个数。一个线程要访问共享资源，先获得信号量，如果信号量的计数器值大于1，意味着有共享资源可以访问，则使其计数器值减去1，再访问共享资源。<br>

```java
public class ResourceManage {  
    private final Semaphore semaphore ;  
    private boolean resourceArray[];  
    private final ReentrantLock lock;  
    public ResourceManage() {  
        this.resourceArray = new boolean[10];//存放厕所状态  
        this.semaphore = new Semaphore(10,true);//控制10个共享资源的使用，使用先进先出的公平模式进行共享;公平模式的信号量，先来的先获得信号量  
        this.lock = new ReentrantLock(true);//公平模式的锁，先来的先选  
        for(int i=0 ;i<10; i++){  
            resourceArray[i] = true;//初始化为资源可用的情况  
        }  
    }  
    public void useResource(int userId){ 
		semaphore.acquire(); 
        try{  
            //semaphore.acquire();  
            int id = getResourceId();//占到一个坑  
            System.out.print("userId:"+userId+"正在使用资源，资源id:"+id+"\n");  
            Thread.sleep(100);//do something，相当于于使用资源  
            resourceArray[id] = true;//退出这个坑  
        }catch (InterruptedException e){  
            e.printStackTrace();  
        }finally {  
            semaphore.release();//释放信号量，计数器加1  
        }  
    }  
    private int getResourceId(){  
        int id = -1; 
		lock.lock();
        try {  
            //lock.lock();//虽然使用了锁控制同步，但由于只是简单的一个数组遍历，效率还是很高的，所以基本不影响性能。  
            for(int i=0; i<10; i++){  
                if(resourceArray[i]){  
                    resourceArray[i] = false;  
                    id = i;  
                    break;  
                }  
            }  
        }catch (Exception e){  
            e.printStackTrace();  
        }finally {  
            lock.unlock();  
        }  
        return id;  
    }  
}  
public class ResourceUser implements Runnable{  
    private ResourceManage resourceManage;  
    private int userId;  
    public ResourceUser(ResourceManage resourceManage, int userId) {  
        this.resourceManage = resourceManage;  
        this.userId = userId;  
    }  
    public void run(){  
        System.out.print("userId:"+userId+"准备使用资源...\n");  
        resourceManage.useResource(userId);  
        System.out.print("userId:"+userId+"使用资源完毕...\n");  
    }  

    public static void main(String[] args){  
        ResourceManage resourceManage = new ResourceManage();  
        Thread[] threads = new Thread[100];  
        for (int i = 0; i < 100; i++) {  
            Thread thread = new Thread(new ResourceUser(resourceManage,i));//创建多个资源使用者  
            threads[i] = thread;  
        }  
        for(int i = 0; i < 100; i++){  
            Thread thread = threads[i];  
            try {  
                thread.start();//启动线程  
            }catch (Exception e){  
                e.printStackTrace();  
            }  
        }  
    }  
}
```

## 死锁

* 线程之间交错执行
	* 解决：以固定的顺序加锁
* 执行某方法时就需要持有锁，且不释放
	* 解决：缩减同步代码块范围，最好仅操作共享变量时才加锁
* 永久等待
	* 解决：使用 `tryLock()` 定时锁，超过时限则返回错误信息