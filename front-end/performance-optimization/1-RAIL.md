<!-- RAIL 评估标准 -->

#### What's RAIL

- R - Response 响应
- A - Animation 动画
- I - Idle 空闲
- L - Load 加载

#### 指标

- 响应: 处理事件应在50ms以内完成(所有的用户操作都应该在100ms内给反馈, 如下图, 我们能做处理的时间不到50ms, 预留时间给浏览器处理)

![INPUTHANDLE.png](./IMAGES/INPUTHANDLE.png)

- 动画: 每10ms产生1帧(60fps, 一秒钟60帧, 一帧大概16ms, 6ms预留给浏览器绘制这一帧的时间)

- 空闲: 尽可能增加空闲时间

- 加载: 在5s内完成内容加载并可以交互