---
title: await-to-js 
author: wb
date: '2022-05-26'
---

# await-to-js 
# 理念 
作者是想用一个简洁的方式解决async/await的时候异常捕获 
# 关键代码 
位置：await-to-js\src\await-to-js.ts 
```javascript
export function to<T, U = Error> (
  promise: Promise<T>,  // 传入promise
  errorExt?: object // 发生错误时应包含的错误信息
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data]) // 成功回调，将结果放在数组第二个位置
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt); // 有额外错误信息进行合并
        return [parsedError, undefined];
      }
      return [err, undefined];  // 错误信息放在数组第一个位置
    });
}
```

# 测试文件 
位置：await-to-js\test\await-to-js.test.ts 
我们重点看传入第二个参数 errorExt 时候的执行 
```javascript
it('should add external properties to the error object', async () => {
    const promise = Promise.reject({ error: 'Error message' });

    const [err] = await to<
      string,
      { error: string; extraKey: number }    // 传入错误时的额外信息
    >(promise, {
      extraKey: 1
    });

    expect(err).toBeTruthy();
    expect((err as any).extraKey).toEqual(1);
    expect((err as any).error).toEqual('Error message')
  });
```
调试可以看到，err 和 errorExt 错误信息进行了合并，最终结果如下 
```javascript
{
  error: "Error message",
  extraKey: 1,
}
```
![](https://cdn.nlark.com/yuque/0/2022/png/12565912/1653574201176-84006aed-f063-46ff-85c0-0767c326cdeb.png#clientId=u64d67330-e410-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=udaba113e&margin=%5Bobject%20Object%5D&originHeight=288&originWidth=1247&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9b308189-c1b8-408e-b560-de4e015ab39&title=)
# scripts 
接下来我们看一下scripts有什么功能 
```javascript
"scripts": {
    "lint": "tslint -t codeFrame 'src/**/*.ts' 'test/**/*.ts'",
    "prebuild": "rimraf dist",
    "build": "tsc && rollup -c && rimraf compiled && typedoc --out dist/docs --target es6 --theme minimal src",
    "start": "tsc -w & rollup -c -w",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:prod": "npm run lint && npm run test -- --coverage --no-cache",
    "deploy-docs": "ts-node tools/gh-pages-publish",
    "report-coverage": "cat ./coverage/lcov.info | coveralls",
    "commit": "git-cz",
    "semantic-release": "semantic-release pre && npm publish && semantic-release post",
    "semantic-release-prepare": "ts-node tools/semantic-release-prepare",
    "precommit": "lint-staged"
  },
```
## 代码检查 
运行：npm run lint 
描述：ts的代码检查工具，-t codeFrame 说明是以 codeFrame 的形式输出信息，后面就是限定的文件范围。查阅文档可知 --fix 可以帮助修复错误 
配置文件：await-to-js\tslint.json 
文档：[TSLint 命令行](https://palantir.github.io/tslint/usage/cli/)
```javascript
"lint": "tslint -t codeFrame 'src/**/*.ts' 'test/**/*.ts'",
```
运行截图如下： 
![](https://cdn.nlark.com/yuque/0/2022/png/12565912/1653574201180-b028de4d-5402-4b14-ab68-5e2b5db60e10.png#clientId=u64d67330-e410-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u2ef73d34&margin=%5Bobject%20Object%5D&originHeight=411&originWidth=521&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ude69a40c-4ad8-406d-aa70-54d0bbd6325&title=)
## 打包 
在这之前我们先运行一下 npx tsc命令，可以看到多了一些文件 
![](https://cdn.nlark.com/yuque/0/2022/png/12565912/1653574201210-132b6c9f-f98d-49cd-b81f-75ba5d79d729.png#clientId=u64d67330-e410-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u27d8aa0b&margin=%5Bobject%20Object%5D&originHeight=345&originWidth=285&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9f76a197-5352-4839-8102-f3242d706c6&title=)
这和tsconfig.json的配置有关 
![](https://cdn.nlark.com/yuque/0/2022/png/12565912/1653574201223-6640c0cc-435b-42f8-b0ad-8d8011f57c99.png#clientId=u64d67330-e410-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u340820a6&margin=%5Bobject%20Object%5D&originHeight=417&originWidth=556&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3dbb17f8-29fb-4e1d-a6e2-0e0f0df51f6&title=)

还有一个小知识点 
scripts中的 && 和 & 
&&：顺序执行多条命令，当碰到执行出错的命令后将不执行后面的命令 
&：并行执行多条命令 

运行：npm run build 
描述： 

1. 首先会触发build钩子函数执行prebild脚本，删除了dist目录。 
1. 执行tsc生成dist和compiled文件。 
1. rollup -c 使用Rollup的配置文件（默认使用rollup.config.js） 
1. 重点看 rollup.config.js 的 input 和output。可以清楚知道打包的输入和输出 
1. 最后执行typedoc命令输出文档 
```javascript
input: `compiled/${libraryName}.js`,
output: [
    { file: pkg.main, name: camelCase(libraryName), format: "umd" },
    { file: pkg.module, format: "es" }
  ],
```
结果如下： 
![](https://cdn.nlark.com/yuque/0/2022/png/12565912/1653574201206-66276ab6-43d9-49e9-91b3-8fdb6df2af77.png#clientId=u64d67330-e410-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=ub9686a2d&margin=%5Bobject%20Object%5D&originHeight=245&originWidth=992&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1d34a5bf-824d-43c2-9e65-5737c35d651&title=)
文档：[rollupjs](https://www.rollupjs.com/guide/command-line-reference)
