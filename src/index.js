const axios = require('axios');
const axiosRetry = require('axios-retry').default;

class Miaotixing {
    constructor({ miaoCode = null, text = '', retries = 3, retryDelay = 1000, timeout = 5000 } = {}) {
        this.defaultMiaoCode = miaoCode;
        this.defaultText = text;
        this.defaultRetries = retries;
        this.defaultRetryDelay = retryDelay;
        this.defaultTimeout = timeout;

        this.axiosInstance = axios.create({
            timeout: this.defaultTimeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        axiosRetry(this.axiosInstance, {
            retries: this.defaultRetries,
            retryDelay: (retryCount) => retryCount * this.defaultRetryDelay,
            retryCondition: (error) => error.response?.status >= 500 || error.code === 'ECONNABORTED',
        });
    }

    async pushNotification({ miaoCode, text, retries, retryDelay, timeout } = {}) {
        const effectiveMiaoCode = miaoCode || this.defaultMiaoCode;
        const effectiveText = text || this.defaultText;

        if (!effectiveMiaoCode) {
            throw new Error('miaoCode is required.');
        }

        if (retries !== undefined || retryDelay !== undefined) {
            axiosRetry(this.axiosInstance, {
                retries: retries || this.defaultRetries,
                retryDelay: (retryCount) => retryCount * (retryDelay || this.defaultRetryDelay),
            });
        }

        if (timeout !== undefined) {
            this.axiosInstance.defaults.timeout = timeout;
        }

        let url = `http://miaotixing.com/trigger?id=${effectiveMiaoCode}`;
        if (String(effectiveText).trim().length > 0) {
            url += `&text=${encodeURIComponent(effectiveText)}`;
        }

        try {
            const response = await this.axiosInstance.get(url);

            if (response.status === 200) {
                const responseData = response.data;

                // 检查是否包含错误或失败信息
                if (responseData.includes('错误') || responseData.includes('失败')) {
                    // VIP 用户的缓冲池提醒
                    if (responseData.includes('转到提醒缓冲池')) {
                        return {
                            success: true,
                            message: '提醒已转入缓冲池，将在稍后发送。',
                            data: responseData,
                        };
                    } else {
                        throw new Error(responseData);
                    }
                }

                // 成功处理
                return {
                    success: true,
                    message: '通知发送成功',
                    data: responseData,
                };

            } else {
                throw new Error(`Unexpected HTTP status code: ${response.status}`);
            }
        } catch (error) {
            // 捕捉 Axios 请求中的错误
            if (error.response) {
                throw new Error(`Failed with status ${error.response.status}: ${error.response.statusText}`);
            } else {
                throw new Error(`Error: ${error.message}`);
            }
        }

    }
}

module.exports = Miaotixing;
