"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2,
  className = "",
}: AnimatedNumberProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {hasAnimated ? (
        <CountUp
          start={prefix ? 0 : 0}
          end={value}
          duration={duration}
          decimals={decimals}
          separator=","
          suffix={suffix}
          prefix={prefix}
        />
      ) : (
        <span>{prefix ? `${prefix}0` : `0${suffix}`}</span>
      )}
    </span>
  );
}

