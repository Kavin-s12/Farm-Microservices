import React, { useState, useEffect } from "react";
import { calculateTimeLeft } from "../functions/calculateTimeLeft";

const TimerComponent = ({ expiresAt, handleExpired }) => {
  const [timer, setTimer] = useState(
    Math.floor((new Date(expiresAt).getTime() - new Date().getTime()) / 1000)
  );

  useEffect(() => {
    if (expiresAt) {
      // Update timer every second
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 0) {
            clearInterval(timerInterval); // Clear interval when timer reaches 0
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      // Clean up function to clear the interval
      return () => clearInterval(timerInterval);
    }
  }, [expiresAt]);

  useEffect(() => {
    if (timer === 0) {
      handleExpired();
    }
  }, [timer, handleExpired]);

  const { minutes, seconds } = calculateTimeLeft(timer);

  return (
    <>
      <span className='text-danger'>
        {minutes}:{seconds}
      </span>
    </>
  );
};

export default TimerComponent;
