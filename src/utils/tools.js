export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const handleTime = (time) => {
    if (!time) {
        return ''
    }
    const date = new Date(time)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    const second = date.getSeconds().toString().padStart(2, '0')

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export const debounce = (fn, delay, immediate = false) => {
    let timer = null;
    return function () {
        const args = arguments;
        const context = this;

        if (immediate) {
            const callNow = !timer;
            if (callNow) {
                fn.apply(context, args);
            }
        }

        clearTimeout(timer);

        timer = setTimeout(() => {
            if (!immediate) {
                fn.apply(context, args);
            }
            timer = null;
        }, delay);
    };
};
