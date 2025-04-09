// https://stackoverflow.com/a/70297487

import { useCallback, useRef } from "react";

export function useLongPress(
  // callback that is invoked at the specified duration or `onEndLongPress`
  callback: () => void,
  // long press duration in milliseconds
  ms: number
) {
  // used to persist the timer state
  // non zero values means the value has never been fired before
  const timerRef = useRef(0);
  const isLongPressTriggered = useRef(false);

  // clear timed callback
  const endTimer = () => {
    clearTimeout(timerRef.current || 0);
    timerRef.current = 0;
  };

  // init timer
  const onStartLongPress = useCallback(() => {
    isLongPressTriggered.current = false;
    // stop any previously set timers
    endTimer();

    // set new timeout
    timerRef.current = window.setTimeout(() => {
      isLongPressTriggered.current = true;
      callback();
      endTimer();
    }, ms);
  }, [callback, ms]);

  
  const onEndLongPress = useCallback(() => {
    endTimer();
  }, []);

  return [onStartLongPress, onEndLongPress, endTimer];
}
