```
// 计算一些关键的性能指标
window.addEventListener('load', (event) => {
    // Time to Interactive
    let timing = performance.getEntriesByType('navigation')[0];
    console.log(timing.domInteractive);
    console.log(timing.fetchStart);
    let diff = timing.domInteractive - timing.fetchStart;
    console.log("TTI: " + diff);
})
```

```
DNS 解析耗时: domainLookupEnd - domainLookupStart
TCP 连接耗时: connectEnd - connectStart
SSL 安全连接耗时: connectEnd - secureConnectionStart
网络请求耗时 (TTFB): responseStart - requestStart
数据传输耗时: responseEnd - responseStart
DOM 解析耗时: domInteractive - responseEnd
资源加载耗时: loadEventStart - domContentLoadedEventEnd
First Byte时间: responseStart - domainLookupStart
白屏时间: responseEnd - fetchStart
首次可交互时间: domInteractive - fetchStart
DOM Ready 时间: domContentLoadEventEnd - fetchStart
页面完全加载时间: loadEventStart - fetchStart
http 头部大小： transferSize - encodedBodySize
重定向次数：performance.navigation.redirectCount
重定向耗时: redirectEnd - redirectStart
```

```
// 观察长任务
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log(entry)
    }
})

observer.observe({entryTypes: ['longtask']})
```

```
// 见面可见性的状态监听
let vEvent = 'visibilitychange';
if (document.webkitHidden != undefined) {
    // webkit prefix detected
    vEvent = 'webkitvisibilitychange';
}

function visibilityChanged() {
    if (document.hidden || document.webkitHidden) {
        console.log("Web page is hidden.")
    } else {
        console.log("Web page is visible.")
    }
}

document.addEventListener(vEvent, visibilityChanged, false);
```

```
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
var type = connection.effectiveType;

function updateConnectionStatus() {
  console.log("Connection type changed from " + type + " to " + connection.effectiveType);
  type = connection.effectiveType;
}

connection.addEventListener('change', updateConnectionStatus);
```