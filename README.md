# 简介

`miaotixing` 是一个 Node.js SDK，方便开发者集成 [喵提醒](https://miaotixing.com) 的提醒服务。通过调用生成的提醒网址，开发者可以向用户发送手机提醒（包括微信公众号推送、短信、语音电话等）。开发者只需在适当的时间访问提醒网址，无需自行处理用户手机号验证或通知发送逻辑。

## 特性

- **简化提醒发送**：开发者只需通过调用喵提醒提供的提醒 URL，便可向用户发送自定义提醒，支持公众号、短信和语音提醒。
- **内置重试机制**：自动处理失败请求，提供自定义重试次数与重试延迟设置。
- **用户负责提醒费用**：提醒费用由用户支付（**公众号提醒免费**），开发者无需承担任何费用。

## 安装

通过 npm 安装 `miaotixing` 库：

```shell
npm install miaotixing
```

## 快速开始

### 初始化

首先，导入 `Miaotixing` 类并进行初始化：

```javascript
const Miaotixing = require('miaotixing');

const miaotixing = new Miaotixing({
    miaoCode: 'your-miao-code',  // 用户在喵提醒生成的提醒码
    text: '这是测试通知',         // 默认的提醒内容
    retries: 3,                   // 请求失败时的重试次数
    retryDelay: 1000,             // 重试延迟时间 (毫秒)
    timeout: 5000                 // 请求超时时间 (毫秒)
});
```

### 发送提醒

通过调用 `pushNotification` 方法，您可以发送提醒：

```javascript
miaotixing.pushNotification()
    .then(response => {
        console.log('提醒发送成功:', response);
    })
    .catch(error => {
        console.error('发送失败:', error.message);
    });
```

### 自定义通知参数

您可以在调用 `pushNotification` 时自定义 `miaoCode` 和 `text`，还可以动态调整重试次数和超时时间：

```javascript
miaotixing.pushNotification({
    miaoCode: 'another-miao-code',   // 覆盖默认的提醒码
    text: '新的测试提醒',              // 自定义提醒内容
    retries: 5,                      // 自定义重试次数
    retryDelay: 2000,                // 自定义重试延迟时间
    timeout: 10000                   // 自定义超时时间
})
.then(response => {
    console.log('自定义通知发送成功:', response);
})
.catch(error => {
    console.error('发送失败:', error.message);
});
```

## 配置参数

- `miaoCode`：必填，喵提醒平台提供的提醒码。
- `text`：提醒的文本内容，默认空字符串。
- `retries`：可选，重试次数，默认为 3。
- `retryDelay`：可选，重试延迟时间，默认为 1000 毫秒。
- `timeout`：可选，请求的超时时间，默认为 5000 毫秒。

## 适用场景

`miaotixing` 非常适合以下场景：

- **定时提醒**：结合脚本或定时任务触发提醒，用户可以在特定时间或事件发生时接收消息。
- **事件驱动提醒**：通过检测用户行为或系统事件（如完成支付、提交表单等）触发提醒。
- **跨平台通知**：支持通过微信公众号、短信或语音提醒，确保用户及时获取重要信息。

## 注意事项

1. **提醒码 (miaoCode)**：在使用该库之前，用户需要在喵提醒平台生成提醒码，并将其传递给开发者。
2. **费用问题**：提醒服务相关的费用由用户自行支付，开发者无需承担费用。

## 错误处理

`pushNotification` 方法会自动处理错误，支持 HTTP 错误代码捕获和重试逻辑。您可以通过 `.catch` 方法捕获并处理异常。

```javascript
miaotixing.pushNotification()
    .catch(error => {
        console.error('提醒发送失败:', error.message);
    });
```

## 关于喵提醒

喵提醒是一个提供提醒服务的微信公众号，用户可以创建提醒后获得一个专属网址，开发者只需访问该网址即可向用户发送通知。喵提醒的通知形式包括公众号推送、短信、语音电话等，提醒内容和提醒方式由用户自行设置，开发者仅需专注于何时调用网址，而无需处理用户手机号验证或通知模块开发。了解更多信息请访问[喵提醒官网](https://miaotixing.com)。

## License

MIT License
