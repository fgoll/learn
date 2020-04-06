// https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB

function open() {
  const openRequest = window.indexedDB.open('TodoList', 1);
  //如果该数据库不存在或指定的版本大于当前版本，都将会触发 onupgradeneeded 事件
  openRequest.onupgradeneeded = function(event) {
    const db = event.target.result;
    const todosStore = db.createObjectStore('todos', { keyPath: 'id', autoIncrement : true });

    // 第一个参数为索引的名称。
    // 第二个参数指定了根据存储数据的哪一个属性来构建索引，其值可以为字符串或字符串数组。
    // 第三个参数指定了该索引的一些约束
    todosStore.createIndex('status', 'status');
  };
  return openRequest;
}


function add(detail) {
  open().onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(['todos'], 'readwrite');
    transaction.oncomplete = function() {
      filter('all');
    };
    transaction.objectStore('todos').add({ detail: detail, status: 'doing' });
  };
}

function update(id, currentStatus) {
  open().onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(['todos'], 'readwrite');
    transaction.oncomplete = function() {
      filter('all');
    };
    const todosStore = transaction.objectStore('todos');
    const result = todosStore.get(id);
    result.onsuccess = function(event) {
      const record = event.target.result;
      record.status = currentStatus === 'doing' ? 'completed' : 'doing';
      todosStore.put(record);
    };
  };
}

function filter(type) {
  open().onsuccess = function(event) {
    const db = event.target.result;

    // 由于 IndexedDB 的数据操作都是基于事务的，因此第一步我们通过 IDBDatabase 
    // 的实例（此处为 db）方法 transaction 来获得了一个只读事务，该实例方法接收 2 个参数：
      // 1. 第一个参数指定要操作的存储空间名称，其值可以为字符串或字符串数组。
      // 2. 第二个参数指定事务的模式，常用值为 readonly 或 readwrite，默认值为 readonly。
    const transaction = db.transaction(['todos'], 'readonly');
    const todosStore = transaction.objectStore('todos');
    const query = type === 'all' ? null : IDBKeyRange.only(type);
    const result = todosStore.index('status').openCursor(query);
    let html = ''
    result.onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
        const record = cursor.value;
        html += `<div class="item ${record.status}" onclick="update(${record.id}, '${record.status}')">${record.detail}（#${record.id}）</div>`;
        cursor.continue();
      }
    }

    transaction.oncomplete = function() {
      document.getElementById('list').innerHTML = html;
    }
  }
}