const Miaotixing  = require('../src/index');

// 实例化时传入默认配置，包括默认的通知内容
const miaotixing = new Miaotixing({
    retries: 5,        // 默认重试次数
    timeout: 8000,      // 默认超时时间
    miaoCode: 't00Sun5',
    text: 'hello'
});

// 使用实例中的默认配置发送通知
miaotixing.pushNotification()
    .then((data) => {
        console.log('成功:', data);
    })
    .catch((error) => {
        console.error('失败:', error.message);
    });
