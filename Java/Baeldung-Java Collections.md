#### Partition a List

##### Use Guava or Commons to partition the List

```java
// Use Guava to partition the List
List<Integer> intList = Lists.newArrayList(1, 2, 3, 4, 5, 6, 7, 8);
List<List<Integer>> subSets = Lists.partition(intList, 3);

List<Integer> lastPartition = subSets.get(2);
List<Integer> expectedLastPartition = Lists.newArrayList(7, 8);
assertThat(subSets.size(), equalTo(3));
assertThat(lastPartition, equalTo(expectedLastPartition));

// Use Guava to partition a Collection
Collection<Integer> intCollection=Lists.newArrayList(1,2,3,4,5,6,7,8);

Iterable<List<Integer>> subSets= Iterables.partition(intCollection,3);

List<Integer> firstPartition=subSets.iterator().next();
List<Integer> expectedLastPartition=Lists.newArrayList(1,2,3);
assertThat(firstPartition,equalTo(expectedLastPartition));

// Use Apache Commons Collections
List<Integer> intList = Lists.newArrayList(1, 2, 3, 4, 5, 6, 7, 8);
List<List<Integer>> subSets = ListUtils.partition(intList, 3);

List<Integer> lastPartition = subSets.get(2);
List<Integer> expectedLastPartition = Lists.newArrayList(7, 8);

assertThat(subSets.size(), equalTo(3));
assertThat(lastPartition, equalTo(expectedLastPartition));
```

##### Use Java8 to partition the List

* Collectors partitioningBy

```java
List<Integer> intList = Lists.newArrayList(1, 2, 3, 4, 5, 6, 7, 8);

// 根据设定规则，分成满足条件组和不满足条件组
Map<Boolean, List<Integer>> groups = intList
        .stream()
        .collect(Collectors.partitioningBy(s -> s > 6));
List<List<Integer>> subSets = new ArrayList<>(groups.values());

List<Integer> lastPartition = subSets.get(1);
List<Integer> expectedLastPartition = Lists.newArrayList(7, 8);
assertThat(subSets.size(), equalTo(2));
assertThat(lastPartition, equalTo(expectedLastPartition));
```

* Collectors groupingBy

```java
List<Integer> intList = Lists.newArrayList(1, 2, 3, 4, 5, 6, 7, 8);

Map<Integer, List<Integer>> groups = intList
        .stream()
        .collect(Collectors.groupingBy(s -> (s - 1) / 3));
List<List<Integer>> subSets = new ArrayList<>(groups.values());

List<Integer> lastPartition = subSets.get(2);
List<Integer> expectedListPartition = Lists.newArrayList(7, 8);
assertThat(subSets.size(), equalTo(3));
assertThat(lastPartition, equalTo(expectedListPartition));
```

* Split the List by separator

```java
List<Integer> intList = Lists.newArrayList(1, 2, 3, 0, 4, 5, 6, 0, 7, 8);
int[] indexes = Stream
        .of(IntStream.of(-1), IntStream.range(0, intList.size()).filter(i -> intList.get(i) == 0), IntStream.of(intList.size()))
        .flatMapToInt(s -> s)
        .toArray();

List<List<Integer>> subSets = IntStream
        .range(0, indexes.length - 1)
        .mapToObj(i -> intList.subList(indexes[i] + 1, indexes[i + 1]))
        .collect(Collectors.toList());

List<Integer> lastPartition = subSets.get(2);
List<Integer> expectedLastPartition = Lists.newArrayList(7, 8);
assertThat(subSets.size(), equalTo(3));
assertThat(lastPartition, equalTo(expectedLastPartition));
```

#### Immutable ArrayList

```java
// With the JDK
Collections.unmodifiableList(list);

// With Guava
ImmutableList.copyOf(list);
// Guava also provides a builder – this will returned the strong-typed ImmutableList instead of simply List
ImmutableList<Object> unmodifiableList = ImmutableList.builder().addAll(list).build();

// With the Apache Collections Commons
ListUtils.unmodifiableList(list);
```

#### Removing all Nulls from a List

* Using Plain Java

```java
List<Integer> list=Lists.newArrayList(1,null,3,null,4,2,null,8);

// 第一种方式
while (list.remove(null));
// 第二种方式
list.removeAll(Collections.singleton(null));
```

* Using Google Guava

```java
List<Integer> list = Lists.newArrayList(null, 2, null, 1);
Iterables.removeIf(list, Predicates.isNull());

//  if we don’t want to modify the source list, Guava will allow us to create a new, filter list
List<Integer> list = Lists.newArrayList(null, 1, null, 2);
List<Integer> listWithoutNull = Lists.newArrayList(Iterables.filter(list, Predicates.notNull()));
```

* Using Apache Commons Collections

```java
// Apache Common Collections
List<Integer> list = Lists.newArrayList(null, 1, 2, null, 3, 4);
CollectionUtils.filter(list, PredicateUtils.notNullPredicate());
```

* Using Lambdas (Java 8)

```java
List<Integer> list = Lists.newArrayList(null, 1, 2, null, 3, null);

// 第一种方式
List<Integer> listWithoutNulls = list
        .parallelStream()
        .filter(Objects::nonNull)
        .collect(Collectors.toList());

// 第二种方式
List<Integer> listWithoutNulls = list
        .stream()
        .filter(Objects::nonNull)
        .collect(Collectors.toList());

// 第三种方式
list.removeIf(Objects::isNull);
```

#### Removing all duplicates from a List

```java
List<Integer> listWithDuplicates = Lists.newArrayList(0, 1, 2, 3, 0, 0);

// using plain Java
List<Integer> listWithoutDuplicates = new ArrayList<>(new HashSet<>(listWithDuplicates));

// using Guava
List<Integer> listWithoutDuplicates = Lists.newArrayList(Sets.newHashSet(listWithDuplicates));

//using Java 8 Lambdas
List<Integer> listWithoutDuplicates = listWithDuplicates
        .stream()
        .distinct()
        .collect(Collectors.toList());
```

#### [LinkedList](http://www.baeldung.com/java-linkedlist)

#### Converting between an Array and a List

* Convert List to Array

```java
List<Integer> sourceList = Arrays.asList(0, 1, 2, 3, 4, 5);

// Using plain Java
Integer[] targetArray = sourceList.toArray(new Integer[sourceList.size()]);

// Using Guava
int[] targetArray = Ints.toArray(sourceList);
```

* Convert Array to List

```java
Integer[] sourceArray = { 0, 1, 2, 3, 4, 5 };

// Using plain Java
// Note that this is a fixed-sized list that will still be backed by the array
List<Integer> targetList = Arrays.asList(sourceArray);
//  If you want a standard ArrayList you can simply instantiate one as so
List<Integer> targetList = new ArrayList<Integer>(Arrays.asList(sourceArray));

// Using Guava
List<Integer> targetList = Lists.newArrayList(sourceArray);

// Using Commons Collections
List<Integer> targetList = new ArrayList<>(6); 
CollectionUtils.addAll(targetList, sourceArray); 
```

#### Converting Between an Array and a Set

* Convert Array to a Set

```java
Integer[] sourceArray = { 0, 1, 2, 3, 4, 5 };

// Using plain Java
Set<Integer> targetSet = new HashSet<Integer>(Arrays.asList(sourceArray));
// Alternatively, the Set can be created first and then filled with the array elements
Set<Integer> targetSet = new HashSet<Integer>();
Collections.addAll(targetSet, sourceArray);

// Using Google Guava
Set<Integer> targetSet = Sets.newHashSet(sourceArray);

// Using Apache Commons Collections 
Set<Integer> targetSet = new HashSet<>(6);
CollectionUtils.addAll(targetSet, sourceArray);
```

* Convert Set to Array

```java
Set<Integer> sourceSet = Sets.newHashSet(0, 1, 2, 3, 4, 5);

// Using plain Java
Integer[] targetArray = sourceSet.toArray(new Integer[sourceSet.size()]);

// Using Guava
int[] targetArray = Ints.toArray(sourceSet);

// Using Commons Collections
Integer[] targetArray = sourceSet.toArray(new Integer[sourceSet.size()]);
```

#### Converting between a List and a Set

* Convert List to Set

```java
List<Integer> sourceList = Lists.newArrayList(0, 1, 2, 3, 4, 5);

// With plain Java
Set<Integer> targetSet = new HashSet<>(sourceList);

// With Guava
Set<Integer> targetSet = Sets.newHashSet(sourceList);

// With Apache Commons Collections
Set<Integer> targetSet = new HashSet<>(6);
CollectionUtils.addAll(targetSet, sourceList);
```

* Convert Set to List

```java
Set<Integer> sourceSet = Sets.newHashSet(0, 1, 2, 3, 4, 5);

// With plain Java
List<Integer> targetList = new ArrayList<>(sourceSet);

// With Guava
List<Integer> targetList = Lists.newArrayList(sourceSet);

// With Apache Commons Collections
List<Integer> targetList = new ArrayList<>(6);
CollectionUtils.addAll(targetList, sourceSet);
```

#### Convert a Map to an Array, List or Set

```java
Map<Integer, String> sourceMap = createMap();

// Map values to Array
Collection<String> values = sourceMap.values();
String[] targetArray = values.toArray(new String[values.size()]);

// Map values to List
List<String> targetList = new ArrayList<>(sourceMap.values());
// using Guava
List<String> targetList = Lists.newArrayList(sourceMap.values());

// Map values to Set
Set<String> targetSet = new HashSet<>(sourceMap.values());
```