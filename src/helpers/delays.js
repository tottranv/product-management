import { message } from "ant-design-vue";

export const debounce = (func, wait = 250) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.call(this, ...args), wait);
    }; 
}

export const showCountdownMessage = (cb, time = 0) => {
    if(!time) {
        cb();
    } else {
        if(!message || (message && !('loading' in message) || !('destroy' in message))) {
            cb();
        } else {
            message.loading('Redirect to login after few seconds', time);
            const interval = setInterval(() => {
                time -= 1;
                if (time === 0) {
                    clearInterval(interval);
                    message.destroy();
                    cb();
                }
            }, 1000);
        }
    }
};
