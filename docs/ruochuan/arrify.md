# arrify

**本文参加了由**[公众号@若川视野](https://lxchuan12.gitee.io)** 发起的每周源码共读活动，**[点击了解详情一起参与。](https://juejin.cn/post/7079706017579139102)

## package.json
exports：导出了index.js
 scripts：只有test命令
xo：ESLint检查
ava：测试运行器
tsd：检查 TypeScript 类型定义

## arrify\index.js
[arrify](https://github.com/sindresorhus/arrify)：将值转换为数组

基本类型：string、number、boolean、null、undefined、symbol、bigint
引用类型：object、array、map、set、Function， Date， RegExp等等

我们可以思考上面的类型如何转换为数组

1. 基本类型理应转换为 [对应类型]
1. 当然基本类型null、undefined，作者提到会返回空数组[]
1. 引用类型中存在[迭代器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#%E5%8F%AF%E8%BF%AD%E4%BB%A3%E5%AF%B9%E8%B1%A1%E7%A4%BA%E4%BE%8B)需要扩展开来，其余的 [对应类型]

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12565912/1653273240588-ace868ea-5a70-4264-a9b0-ec3422374746.png#clientId=u8b6063b5-ac23-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=366&id=ua86e232b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=366&originWidth=454&originalType=binary&ratio=1&rotation=0&showTitle=false&size=21518&status=done&style=none&taskId=u22b50b2d-6ec1-42d2-8cc5-a4ee6ff87fb&title=&width=454)
看源代码判断顺序如下：

1. null和undefined
1. 数组
1. 字符串（字符串判断放在这里是因为，字符串String 内置了可迭代对象）
1. 是否是迭代器
1. 剩余其它类型直接包裹成数组

## arrify\test.js
看一下npm run test
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12565912/1653275007284-c1f08055-1ace-44c9-9ef3-26dda0c8c631.png#clientId=u8b6063b5-ac23-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=57&id=u8a14b015&margin=%5Bobject%20Object%5D&name=image.png&originHeight=57&originWidth=287&originalType=binary&ratio=1&rotation=0&showTitle=false&size=2755&status=done&style=none&taskId=u5fa1fbab-eff9-4799-9785-fe023c3649b&title=&width=287)

### xo
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12565912/1653286825410-6db173b4-cee7-4d96-bd6f-f8f12baf05ee.png#clientId=u8b6063b5-ac23-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=333&id=u09ece6b2&margin=%5Bobject%20Object%5D&name=image.png&originHeight=333&originWidth=885&originalType=binary&ratio=1&rotation=0&showTitle=false&size=47012&status=done&style=none&taskId=u5232dd5b-efaf-4dcc-a29a-165cf928bf4&title=&width=885)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12565912/1653286835950-3a6fddd0-9a6e-43a8-81aa-a90612032f30.png#clientId=u8b6063b5-ac23-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=161&id=uf52c728c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=161&originWidth=588&originalType=binary&ratio=1&rotation=0&showTitle=false&size=8680&status=done&style=none&taskId=ub2ad2d78-29ee-4354-a8f5-7d0aadd28d1&title=&width=588)

### ava
test.js覆盖了代码中的if判断

### tsd
arrify\index.d.ts
![image.png](https://cdn.nlark.com/yuque/0/2022/png/12565912/1653287886317-4af114b2-92ef-4d44-9fb4-df21d66122b2.png#clientId=u8b6063b5-ac23-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=223&id=u94eb04f9&margin=%5Bobject%20Object%5D&name=image.png&originHeight=223&originWidth=564&originalType=binary&ratio=1&rotation=0&showTitle=false&size=22711&status=done&style=none&taskId=ubbec2795-b0f4-4e85-b669-45e5003611b&title=&width=564)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/12565912/1653288058413-b3524d29-b94c-4250-90da-132fe4c17b92.png#clientId=u8b6063b5-ac23-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=217&id=uc0a1ba0b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=217&originWidth=542&originalType=binary&ratio=1&rotation=0&showTitle=false&size=27563&status=done&style=none&taskId=u8d7c37dc-a8ad-412d-ab72-172a6b54366&title=&width=542)



