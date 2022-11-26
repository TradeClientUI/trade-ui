# trade-ui

A comprehensive asset trading system that supports digital currency spot, contract, leverage, and stock and foreign exchange transactions

## 安装依赖包
```
npm install
```

### 本地运行开发模式
```
npm run dev
```

### 打包构建
```
npm run build_wp
```


## 开发注意事项

- `/src/themes`子级是各主题的私有业务代码，`/src/themes`兄弟目录都是公共资源，公共资源不允许引入私有业务代码；
- 颜色换肤使用css变量实现，所以页面内所有元素都不能写死颜色值，须使用css颜色变量赋值；(如 color: var(--bdColor))
- 获取用户信息统一使用 `FindCustomerInfo()`方法，导入文件：`import FindCustomerInfo from '@m/compositionApi/findCustomerInfo'`
- 除了密码之外所有的呼输入框需做`trim`处理

## 关于时区

cats2 H5里面由于时区功能对`dayjs`做了一些封装；   
直接`import dayjs, from 'dayjs'` 是封装后的`dayjs`，包含了时区处理   
`import { _dayjs } from 'dayjs'` 导入的`_dayjs`是`源dayjs`，如果有特殊需求可以使用`_dayjs`

## 关于颜色

cats2 H5里面所有的颜色都必须使用颜色变量；   
js里面需要用到的颜色可以使用`store.state.style`，也可以使用全局`mixin`的 `$style`计算器属性

## store里面常用数据
- `store.state._user.customerInfo` // 当前登录的用户信息
- `store.getters['_user/userAccountType']` // 账户类型，G游客, D模拟, R_1真实未入金, R_2真实已入金, R_3真实已激活
- `store.getters.customerGroupId` // 当前客户组(包括游客账户组)
- `store.getters.productActived` // 当前操作的产品信息
- `store.getters.userSelfSymbolList` // 当前用户的自选产品列表


## Changelog
Detailed changes for each release are documented in the [release notes](CHANGELOG.md).
