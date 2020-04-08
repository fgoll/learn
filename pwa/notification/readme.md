
```
+-------+           +--------------+       +-------------+
|  UA   |           | Push Service |       | Application |
+-------+           +--------------+       |   Server    |
    |                      |               +-------------+
    |      Subscribe       |                      |
    |--------------------->|                      |
    |       Monitor        |                      |
    |<====================>|                      |
    |                      |                      |
    |          Distribute Push Resource           |
    |-------------------------------------------->|
    |                      |                      |
    :                      :                      :
    |                      |     Push Message     |
    |    Push Message      |<---------------------|
    |<---------------------|                      |
    |                      |                      |
```

- UA：客户端。
- Push Service：一般由浏览器服务商提供，比如 chrome 和 firefox 自己的 Push Service。
- Application Server：服务端，开发者自己提供。

其工作流程为：

- Subscribe：浏览器通过询问（如下图）的方式让用户选择是否允许显示通知，如允许则向 Push Service 发起订阅请求，订阅成功后返回 PushSubscription 对象。
- Monitor：订阅成功后，Push Service 将保持与客户端的联系，主要作用是将服务端推送的消息发送到客户端。
- Distribute Push Resource：订阅成功后，客户端需要将 PushSubscription 对象中的验证信息发送给服务端，并在服务端进行保存。
- Push Message：服务端推送的消息并不是直接发给客户端的，而是发给 Push Service，后者对消息进行校检后，再将消息推送给客户端。
