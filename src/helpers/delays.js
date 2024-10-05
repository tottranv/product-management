import { message } from "ant-design-vue";

export const debounce = (func, wait = 250) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.call(this, ...args), wait);
    }; 
}

export const showCountdownMessage = (time = 3, cb) => {
    let countdown = time;
    message.loading('Redirect to login after few seconds', 0);

    const interval = setInterval(() => {
        countdown -= 1;
        if (countdown === 0) {
            clearInterval(interval);
            message.destroy();
            cb();
        }
    }, 1000);
};
