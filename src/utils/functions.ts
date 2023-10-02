export function throttle<T, A extends Array<unknown>>(
  fn: (this: T, ...args: A) => void,
  wait: number = 50,
) {
  let lastFn: number;
  let lastTime: number;
  let inThrottle: boolean;

  return function (this: T, ...args: A) {
    if (!inThrottle) {
      fn.apply(this, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn.apply(this, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
}
