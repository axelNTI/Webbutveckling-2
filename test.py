import threading
import time
import random


# This function will be executed by each thread
def routine(num):
    # Sleeping time is proportional to the number
    time.sleep(num / 1000.0)  # Sleep for 'num' milliseconds
    


def quicksort(arr: list) -> list:
    if len(arr) < 2:
        return arr
    mid = len(arr) // 2
    if arr[0] > arr[mid]:
        arr[0], arr[mid] = arr[mid], arr[0]
    if arr[0] > arr[-1]:
        arr[0], arr[-1] = arr[-1], arr[0]
    if arr[mid] > arr[-1]:
        arr[mid], arr[-1] = arr[-1], arr[mid]
    pivot = arr[mid]
    less, equal, greater = [], [], []
    for i in arr:
        if i < pivot:
            less.append(i)
        elif i == pivot:
            equal.append(i)
        else:
            greater.append(i)
    return quicksort(less) + equal + quicksort(greater)


# A function that performs sleep sort
def sleep_sort(arr):
    threads = []

    # Create a thread for each element in the input array
    for num in arr:
        thread = threading.Thread(target=routine, args=(num,))
        threads.append(thread)
        thread.start()

    # Wait for all threads to finish
    for thread in threads:
        thread.join()


if __name__ == "__main__":
    # Doesn't work for negative numbers
    arr = [random.randint(1, 100) for _ in range(100000)]
    arr2 = arr.copy()
    start = time.perf_counter_ns()
    sleep_sort(arr)
    stop = time.perf_counter_ns()
    print(f"\nTime taken: {stop-start} ns")
    start = time.perf_counter_ns()
    quicksort(arr2)
    stop = time.perf_counter_ns()
    print(f"Time taken: {stop-start} ns")
