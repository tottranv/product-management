export const debounce = (func, wait = 250) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.call(this, ...args), wait);
    }; 
}
