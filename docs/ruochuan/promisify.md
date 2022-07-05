# promisify

> 感谢若川大佬的源码活动

### 1. 学习方式

- 快速阅读文章，记录问题
- clone代码，对应文章仔细阅读

### 2. remote-git-tags

- 作用：[remote-git-tags](https://www.npmjs.com/package/remote-git-tags)从远程 Git 存储库获取标签
- 主要方法：remoteGitTags(repoUrl)
- 原理：git ls-remote --tags repoUrl
- 注意事项：电脑需要安装git

先运行一遍，看看发生了什么
npm run test 发生错误
![image.png](https://cdn.nlark.com/yuque/0/2021/png/12565912/1636786903600-6275413a-1981-4d86-a9c0-cb2d9486d781.png#clientId=u2f8486bb-9319-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=127&id=u33b21f95&margin=%5Bobject%20Object%5D&name=image.png&originHeight=254&originWidth=1326&originalType=binary&ratio=1&rotation=0&showTitle=false&size=32612&status=done&style=none&taskId=u215ef444-1b93-448b-9675-295eba0f12b&title=&width=663)
解决方法：关掉代理
```javascript
// remote-git-tags\test.js
import test from 'ava';
import remoteGitTags from './index.js';

test('main', async t => {
	// 获取got仓库的tags
	const tags = await remoteGitTags('https://github.com/sindresorhus/got');
	// 测试 标签和hash值 是否相等
	t.is(tags.get('v6.0.0'), 'e5c2d9e93137263c68db985b3dc5b57865c67b82');
	t.is(tags.get('v5.0.0'), '0933d0bb13f704bc9aabcc1eec7a8e33dc8aba51');
});
// 结果 1 test passed
```

### 3. package.json

新知识npm官网的Dependents指这个包被谁给使用
![image.png](https://cdn.nlark.com/yuque/0/2021/png/12565912/1636788924177-202be652-3bdb-4247-b2c7-d29c846da0f3.png#clientId=u2f8486bb-9319-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=257&id=u59c68260&margin=%5Bobject%20Object%5D&name=image.png&originHeight=513&originWidth=1462&originalType=binary&ratio=1&rotation=0&showTitle=false&size=95635&status=done&style=none&taskId=u3ad3a353-f290-4510-879f-842453bcd9e&title=&width=731)

#### 3.1 type
![](https://cdn.nlark.com/yuque/0/2021/jpeg/12565912/1636790680977-9b2ab05f-80ca-4993-b546-8de364cec3b6.jpeg)

#### 3.2 engines
可选值：node、npm
作用：可以指定项目运行的node版本范围，不指定版本范围或者指定为*表示任何版本
注意：engines字段只是建议性的，将包作为依赖项安装时才会产生警告
参考：[npm/package.json](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#engines)
```json
{
  "engines": {
		"node": "^12.20.0 || ^14.13.1 || >=16.0.0"
	}
}
```
#### 3.3 版本语法
语义版本控制所有的版本都有 3 个数字：x.y.z。

- 第一个数字是主版本。进行不兼容的 API 更改时，则升级主版本。
- 第二个数字是次版本。以向后兼容的方式添加功能时，则升级次版本。
- 第三个数字是补丁版本。进行向后兼容的缺陷修复时，则升级补丁版本。

^：表示主版本固定，更新最新版本。例外如果主版本是0，则次版本保持不变。
~：表示次版本固定，更新最新版本。 
>、>= 、<、<=、=：表示高于低于等于。
-：表示范围版本。例如：12.2.0 - 14.13.1
||：表示组合。1.0.0 || >=1.1.0 <1.2.0，即使用 1.0.0 或从 1.1.0 开始但低于 1.2.0 的版本
无符号: 仅接受指定的特定版本
latest: 使用可用的最新版本。

#### 3.4 package-lock.json
作用：锁定包的版本号，保证开发人员依赖包一致。
使用package-lock.json锁定版本后，可以运行npm update命令，其会根据语义化版本控制，更新 package-lock.json 文件中的依赖的版本。
package-lock.json 在npm5.0的时候经历过一系列变动。详情可看参考链接

#### 3.5 参考链接
[Node使用 npm 的语义版本控制](http://nodejs.cn/learn/semantic-versioning-using-npm)
[依赖版本变动引发的惨案](https://juejin.cn/post/6874221779100008456)
[关于package-lock.json的一切](https://segmentfault.com/a/1190000017239545)
[

](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies)

### 4. 源码
使用的方法：[promisify](http://nodejs.cn/api/util.html#utilpromisifyoriginal)、[execFile](http://nodejs.cn/api/child_process.html#child_processexecfilefile-args-options-callback)
```javascript
import {promisify} from 'node:util';
import childProcess from 'node:child_process';

const execFile = promisify(childProcess.execFile);

export default async function remoteGitTags(repoUrl) {
  // stdout字符串形如: '0a861a\trefs/tags/v9.6.0\na45e07\trefs/tags/v9.6.0^{}\n'
	const {stdout} = await execFile('git', ['ls-remote', '--tags', repoUrl]);
	const tags = new Map();
	// 下面对stdout解析，找到我们需要的 tagName和hash
	for (const line of stdout.trim().split('\n')) {
		const [hash, tagReference] = line.split('\t');

		// `refs/tags/v9.6.0^{}` → `v9.6.0`
		const tagName = tagReference.replace(/^refs\/tags\//, '').replace(/\^{}$/, '');

		tags.set(tagName, hash);
	}

	return tags;
}
```

### 5. promisify
作用：将使用 callback 形式处理结果转成 promise 形式的方法。
回调函数的风格应遵循 错误优先（即 (err, value) => ... 回调作为最后一个参数）

#### 5.1 通用的promisify
```javascript
function promisify(original){
  	// args调用函数时传的参数
    function fn(...args){
        return new Promise((resolve, reject) => {
          	// callback是最后的参数
            args.push((err, ...values) => {
              	// 对返回的参数进行resolve和reject判断
                if(err){
                    return reject(err);
                }
                resolve(values);
            });
          	// 执行方法
            // original.apply(this, args);
            Reflect.apply(original, this, args);
        });
    }
    return fn;
}
```
 [Reflect.apply(target, thisArgument, argumentsList)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply)：静态方法，通过指定的参数列表发起对目标(target)函数的调用。

#### 5.2 Node的promisify
本来想调试Node的promisify，但是调试不了，所以下面按照个人理解注释。

 [代码](https://github1s.com/nodejs/node/blob/master/lib/internal/util.js)
```javascript
const kCustomPromisifiedSymbol = SymbolFor('nodejs.util.promisify.custom');
const kCustomPromisifyArgsSymbol = Symbol('customPromisifyArgs');

let validateFunction;

function promisify(original) {
  // Lazy-load to avoid a circular dependency.
  if (validateFunction === undefined)
    ({ validateFunction } = require('internal/validators'));
	// 校验是否为函数
  validateFunction(original, 'original');
	// 自定义的 promise 化函数，详情可看Node文档
  // 主要用于不遵循将错误优先的回调作为最后一个参数的标准格式的情况
  if (original[kCustomPromisifiedSymbol]) {
    // 获取自定义的处理函数
    const fn = original[kCustomPromisifiedSymbol];

    validateFunction(fn, 'util.promisify.custom');

    return ObjectDefineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
  }

  // Names to create an object from in case the callback receives multiple
  // arguments, e.g. ['bytesRead', 'buffer'] for fs.read.
  const argumentNames = original[kCustomPromisifyArgsSymbol];

  function fn(...args) {
    return new Promise((resolve, reject) => {
      ArrayPrototypePush(args, (err, ...values) => {
        if (err) {
          return reject(err);
        }
        // 处理返回值
        if (argumentNames !== undefined && values.length > 1) {
          const obj = {};
          for (let i = 0; i < argumentNames.length; i++)
            obj[argumentNames[i]] = values[i];
          resolve(obj);
        } else {
          resolve(values[0]);
        }
      });
      ReflectApply(original, this, args);
    });
  }

  ObjectSetPrototypeOf(fn, ObjectGetPrototypeOf(original));

  ObjectDefineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return ObjectDefineProperties(
    fn,
    ObjectGetOwnPropertyDescriptors(original)
  );
}

promisify.custom = kCustomPromisifiedSymbol;
```

### 6. 总结

   - 学习源码如果有人指点，可以少走很多弯路，感谢川哥
   - 源码本身内容可能不多，但是它附带的内容很值得去学习巩固


值得收藏的网站：

- [ECMAScript5.1中文版](https://link.juejin.cn/?target=https%3A%2F%2Fyanhaijing.com%2Fes5%2F)
- [《ES6 入门教程》](https://link.juejin.cn/?target=https%3A%2F%2Fes6.ruanyifeng.com%2F) 
