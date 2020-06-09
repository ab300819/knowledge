<!-- TOC -->

- [排序算法](#排序算法)
    - [选择排序](#选择排序)
    - [插入排序](#插入排序)
    - [冒泡排序](#冒泡排序)
    - [快速排序](#快速排序)
    - [希尔排序](#希尔排序)
    - [归并排序](#归并排序)

<!-- /TOC -->

# 排序算法

## 选择排序

**不稳定**

时间复杂度：O(n^2)
空间复杂度：O(1)

```java
public static void selectionSort(int[] data) {

    int dataLength = data.length;

    for (int i = 0; i < dataLength; i++) {

        int min = i;
        for (int j = i + 1; j < dataLength; j++) {

            if (data[min] > data[j]) {
                min = j;
            }
        }
        if (min != i) {
            int temp = data[i];
            data[i] = data[min];
            data[min] = temp;
        }
    }
}
```

## 插入排序

**稳定**

时间复杂度：O(n^2)
空间复杂度：O(1)

```java
public static void insertionSort(int[] data) {

    int dataLength = data.length;

    for (int i = 0; i < dataLength; i++) {
        for (int j = 0; j < i; j++) {
            if (data[j] > data[i]) {
                int temp = data[j];
                data[j] = data[i];
                data[i] = temp;
            }
        }
    }
}
```

## 冒泡排序

**稳定**

时间复杂度：O(n^2)
空间复杂度：O(1)

```java
public static void bubbleSort(int[] data) {

    int dataLength = data.length;

    for (int i = 0; i < dataLength; i++) {
        for (int j = i; j < dataLength - 1; j++) {

            if (data[i] > data[j + 1]) {
                int temp = data[j + 1];
                data[j + 1] = data[i];
                data[i] = temp;
            }

        }
    }
}
```

## 快速排序

**不稳定**

时间复杂度：O(nlogn)期望时间，O(n^2)最坏情况
空间复杂度：O(logn)

```java
public static void quickSort(int[] data, int low, int high) {

    if (high <= low) {
        return;
    }

    int j = partition(data, low, high);
    quickSort(data, low, j - 1);
    quickSort(data, j + 1, high);

}

public static int partition(int[] data, int low, int high) {

    int i = low;
    int j = high + 1;

    int v = data[low];

    while (true) {

        while (data[++i] < v) {
            if (i == high) break;
        }
        while (v < data[--j]) {
            if (j == low) break;
        }

        if (i >= j) break;

        int temp = data[j];
        data[j] = data[i];
        data[i] = temp;
    }

    int temp = data[j];
    data[j] = data[low];
    data[low] = temp;

    return j;
}
```

## 希尔排序

**不稳定**

时间复杂度：O(nlogn)期望时间
空间复杂度：O(1)

```java
public static void shellSort1(int[] data) {

    int dataLength = data.length;

    // 步长为一半
    for (int i = dataLength / 2; i > 0; i /= 2) {

        for (int j = i; j < dataLength; j++) {

            for (int k = j - i; k >= 0; k -= i) {
                if (data[j] < data[k]) {
                    int temp = data[k];
                    data[k] = data[j];
                    data[j] = temp;
                }
            }
        }
    }
}

public static void shellSort2(int[] data) {

    int dataLength = data.length;
    int step = 1;

    while (step < dataLength / 3) {
        step = step * 3 + 1;
    }

    for (; step >= 1; step /= 3) {

        for (int i = step; i < dataLength; i++) {
            for (int j = i; j >= step; j -= step) {
                if (data[j] < data[j - step]) {
                    int temp = data[j];
                    data[j] = data[j - step];
                    data[j - step] = temp;
                }
            }
        }
    }
}
```

## 归并排序

**稳定**

时间复杂度：O(nlogn)
空间复杂度: O(n)+O(logn)(如果不是重上到小)，O(1)

```java
public static void mergeSort(int[] data, int low, int high) {

    if (high <= low) {
        return;
    }

    int mid = low + (high - low) / 2;
    mergeSort(data, low, mid);
    mergeSort(data, mid + 1, high);
    merge(data, low, mid, high);
}

public static void merge(int[] data, int low, int mid, int high) {

    int i = low;
    int j = mid + 1;

    int temp[] = new int[data.length];
    arrayCopy(data, temp);

    for (int k = low; k <= high; k++) {

        if (i > mid) {
            data[k] = temp[j++];
        } else if (j > high) {
            data[k] = temp[i++];
        } else if (temp[i] < temp[j]) {
            data[k] = temp[i++];
        } else {
            data[k] = temp[j++];
        }
    }
}
```

```java
// 自下向上
public static void down2Top(int[] data) {

    int dataLength = data.length;
    int[] temp = new int[dataLength];

    for (int i = 1; i < dataLength; i = i + i) {
        for (int j = 0; j < dataLength - i; j += i + i) {
            merge(data, j, j + i - 1, Math.min(j + i + i - 1, dataLength - 1));
        }
    }

}
```