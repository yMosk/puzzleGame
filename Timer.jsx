import React, { useEffect, useState } from "react";

export const TimerContainer = ({ timerHandler, stopTimer }) => {
  const [timer, setTimer] = useState("00:00");

  useEffect(() => {
    timerHandler(timer);
  }, [timer, timerHandler]);

  return <Timer setTimer={setTimer} stopTimer={stopTimer} />;
};

export const Timer = ({ setTimer, stopTimer }) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  let timer;

  useEffect(() => {
    if (!stopTimer) {
      timer = setInterval(() => {
        setSeconds(seconds + 1);

        if (seconds === 59) {
          setMinutes(minutes + 1);
          setSeconds(0);
        }
      }, 1000);

      setTimer(
        `${minutes < 10 ? "0" + minutes : minutes}:${
          seconds < 10 ? "0" + seconds : seconds
        }`
      );
    } else if (stopTimer) {
      setSeconds(0);
      setMinutes(0);
    }

    return () => clearInterval(timer);
  });

  return (
    <span>
      {minutes < 10 ? "0" + minutes : minutes}:
      {seconds < 10 ? "0" + seconds : seconds}
    </span>
  );
};

export default Timer;
