function quickSelect(nums, k) {
  let lo = 0, hi = nums.length - 1;
 
  while (lo < hi) {
    let i = lo, j = hi;
    let pivot = nums[lo];

    while (i < j) {
      while ((i < j) && nums[j] >= pivot) j --;
      nums[i] = nums[j];
      while ((i < j) && nums[i] <= pivot) i ++;
      nums[j] = nums[i];
    }
    nums[i] = pivot;

    if (k <= i) {
      hi = i - 1;
    }
    if (k >= i) {
      lo = i + 1;
    }
  }

  return nums[k]
}

console.log(quickSelect([5,62,3,1,662,32,23,562,62], 6))