var __extends = (this && this.__extends) || (function () {
  var extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
  return function (d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
var Vector = /** @class */ (function () {
  function Vector(elem) {
      elem = elem || [];
      this._elem = elem.slice();
  }
  Vector.prototype.length = function () {
      return this._elem.length;
  };
  Vector.prototype.uniquify = function () {
      var i = 0, j = 0;
      while (++j < this._elem.length) {
          if (this._elem[i] != this._elem[j]) {
              this._elem[++i] = this._elem[j];
          }
      }
      i++;
      this._elem.length = i;
      return j - i;
  };
  Vector.prototype.set = function (r, e) {
      this._elem[r] = e;
  };
  Vector.prototype.get = function (r) {
      return this._elem[r];
  };
  Vector.prototype.find = function (e, lo, hi) {
      while ((lo < hi--) && (e < this._elem[hi]))
          ;
      return hi;
  };
  Vector.prototype.search = function (e) {
      return this.find(e, 0, this._elem.length);
  };
  Vector.prototype.insert = function (r, e) {
      for (var i = this.length(); i > r; i--) {
          this._elem[i] = this._elem[i - 1];
      }
      this._elem[r] = e;
      return r;
  };
  Vector.prototype.removeIn = function (lo, hi) {
      if (lo == hi)
          return 0;
      while (hi < this.length())
          this._elem[lo++] = this._elem[hi++];
      this._elem.length = lo;
      return hi - lo;
  };
  Vector.prototype.remove = function (r) {
      var e = this._elem[r];
      this.removeIn(r, r + 1);
      return e;
  };
  Vector.prototype.deduplicate = function () {
      var elem = this._elem.slice();
      this.mergeSort(0, this.length());
      var count = this.uniquify();
      // let arr = []
      // let v = new Vector(elem)
      // for (let i = 0; i < elem.length; i ++) {
      //   let val = elem[i]
      //   let fidx = this.binSearch(val, 0, this.length())
      //   if (fidx != -1) {
      //     this.remove(fidx, fidx+1)
      //     arr.push(val)
      //   }
      // }
      // this._elem = arr
      return count;
  };
  Vector.prototype.deduplicate2 = function () {
      var i = 1;
      while (i < this.length()) {
          this.find(this._elem[i], 0, i) == -1 ? i++ : this.removeIn(i, i + 1);
      }
  };
  Vector.prototype.binSearch = function (e, lo, hi) {
      while (lo < hi) {
          var mi = Math.floor((hi + lo) / 2);
          if (e < this._elem[mi]) {
              hi = mi;
          }
          else if (e > this._elem[mi]) {
              lo = mi + 1;
          }
          else {
              return mi;
          }
      }
      return -1;
  };
  Vector.prototype.bubbleSort = function (lo, hi) {
      while (!this.bubble(lo, hi))
          ;
  };
  Vector.prototype.bubble = function (lo, hi) {
      var sorted = true;
      while (++lo < hi) {
          if (this._elem[lo - 1] > this._elem[lo]) {
              sorted = false;
              var temp = this._elem[lo - 1];
              this._elem[lo - 1] = this._elem[lo];
              this._elem[lo] = temp;
          }
      }
      return sorted;
  };
  Vector.prototype.mergeSort = function (lo, hi) {
      if (hi - lo < 2)
          return;
      var mi = Math.floor((lo + hi) / 2);
      this.mergeSort(lo, mi);
      this.mergeSort(mi, hi);
      // console.log('先merge:', lo, mi, hi)
      this.merge(lo, mi, hi);
  };
  Vector.prototype.merge = function (lo, mi, hi) {
      var lb = mi - lo;
      var A = this._elem;
      var B = this._elem.slice(lo, mi);
      var lc = hi - mi;
      // console.log(lo, mi, hi)
      // console.log(A)
      // console.log(B)
      // console.log(A[mi])
      for (var i = 0, j = 0, k = 0; (j < lb) || (k < lc);) {
          if ((j < lb) && (!(k < lc) || B[j] <= A[mi + k])) {
              A[lo + i] = B[j++];
              i++;
          }
          if ((k < lc) && (!(j < lb) || A[mi + k] < B[j])) {
              A[lo + i] = A[mi + k];
              i++;
              k++;
          }
      }
  };
  Vector.prototype.heapSort = function () {
      var size = this.length();
      var H = new PQ_ComplHeap(this._elem, size);
      while (!H.empty()) {
          console.log(H);
          this._elem[--size] = H.delMax();
      }
  };
  return Vector;
}());
function inHeap(n, i) {
  return i >= 0 && i < n;
}
function parentVaild(i) {
  return i > 0;
}
function parent(i) {
  return (i - 1) >> 1;
}
function lastInternal(n) {
  return parent(n - 1);
}
function bigger(PQ, i, j) {
  return PQ[i].point.x > PQ[j].point.x ? j : i;
}
function lChild(i) {
  return 1 + (i << 1);
}
function rChild(i) {
  return (i + 1) << 1;
}
function rChildValid(n, i) {
  return inHeap(n, rChild(i));
}
function lChildValid(n, i) {
  return inHeap(n, lChild(i));
}
function properParent(PQ, n, i) {
  return rChildValid(n, i) ? bigger(PQ, bigger(PQ, i, lChild(i)), rChild(i)) :
      lChildValid(n, i) ? bigger(PQ, i, lChild(i)) : i;
}
var PQ_ComplHeap = /** @class */ (function (_super) {
  __extends(PQ_ComplHeap, _super);
  function PQ_ComplHeap(A, n) {
      var _this = _super.call(this, A) || this;
      if (n) {
          _this.heapify(n);
      }
      return _this;
  }
  PQ_ComplHeap.prototype.percolateDown = function (n, i) {
      var j;
      while (i != (j = properParent(this._elem, n, i))) {
          _a = [this._elem[j], this._elem[i]], this._elem[i] = _a[0], this._elem[j] = _a[1];
          i = j;
      }
      return i;
      var _a;
  };
  PQ_ComplHeap.prototype.percolateUp = function (i) {
      while (parentVaild(i)) {
          var j = parent(i);
          if (this._elem[i].point.x >= this._elem[j].point.x)
              break;
          _a = [this._elem[j], this._elem[i]], this._elem[i] = _a[0], this._elem[j] = _a[1];
          i = j;
      }
      var _a;
  };
  PQ_ComplHeap.prototype.heapify = function (n) {
      for (var i = lastInternal(n); inHeap(n, i); i--) {
          this.percolateDown(n, i);
      }
  };
  PQ_ComplHeap.prototype.empty = function () {
      return this._elem.length === 0;
  };
  PQ_ComplHeap.prototype.insertH = function (e) {
      this.insert(this.length(), e);
      this.percolateUp(this.length() - 1);
  };
  PQ_ComplHeap.prototype.getMax = function () {
      return this._elem[0];
  };
  PQ_ComplHeap.prototype.delMax = function () {
      var maxElem = this._elem[0];
      if (this._elem.length > 1) {
          this._elem[0] = this._elem.pop();
          this.percolateDown(this.length(), 0);
      }
      else {
          this._elem.pop();
      }
      return maxElem;
  };
  return PQ_ComplHeap;
}(Vector));