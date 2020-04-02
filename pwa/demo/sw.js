
// =======> 安装
// 注册完成后，浏览器便会立即尝试安装并进入`安装`状态, 在该事件中我们经常对静态资源进行缓存处理

// 并不是每次注册成功后都会进入安装状态并触发 Service Worker 的 install 事件，其需要满足以下两个条件中的任意一个：
//  1. 页面中尚未安装 Service Worker。
//  2. Service Worker 已安装，并且从服务器获取的 sw.js 文件与本地版本存在差异。
self.addEventListener('install', function(event) {
  // event.waitUntil 的参数是一个 Promise 对象，并且：
  //  1. 等待直到参数为 resolve 状态时，Service Worker 才会进入下一个生命周期。
  //  2. 如果最终参数为 reject 状态，Service Worker 安装失败，我们无需为此做特殊的处理，因为在下次进行注册时，会重新进行安装尝试。
  event.waitUntil(
    caches.open('sw-cache').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/main.css',
        '/main.js',
        '/image.jpg'
      ]);
    })
  );

  // 安装成功后，如果已经存在一个版本的 Service Worker 且有页面正在使用该版本，
  // 新版 Service Worker 便会进入等待状态，当 Service Worker 处于该阶段时，
  // 由于它必须等正在运行旧版本 Service Worker 的页面全部关闭后才会获得控制权，
  // 因此如果我们需要所有页面能够及时得到更新，可在 install 中通过 self.skipWaiting 来强制跳过该阶段：
  self.skipWaiting();
});

// =======> 激活
// 当满足以下任一条件，Service Worker 便可进入该阶段：
//  1. self.skipWaiting 方法被调用。
//  2. 安装完成后，不存在旧版本的 Service Worker 或无页面使用此版本。
//  3. 等待状态下正在运行旧版本 Service Worker 的页面被全部关闭（页面刷新或切换无法使 Service Worker 从等待进入激活状态，
//     这是由于当页面刷新或切换时，浏览器需要等到新页面渲染完成之后才会销毁旧页面，即新旧两个页面存在共同的交叉时间）
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName != 'sw-cache';
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


// =======> 已激活
// 到了这一阶段，便可通过监听 fetch、push、sync、message 等事件来为应用提供丰富的离线处理能力。

self.addEventListener('fetch', function(event) {
});

/**
install：安装事件，一般对静态资源文件进行缓存处理。
activate：激活事件，一般用于更新或删除旧版本的缓存。
fetch：接收 Service Worker 作用域下的 fetch 事件，在该事件中可以做各种缓存代理的事情。
sync：后台同步事件，由 BackgroundSync API 发出。
message：由于 Service Worker 以独立线程运行，通过该事件可以实现与主进程的交互。
push：响应来自系统的推送消息。
notificationclick：推送通知点击事件，一般用来处理通知与用户的交互。
 */