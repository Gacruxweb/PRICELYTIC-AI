import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export function TypewriterText({ text, className, speed = 150, delay = 2000 }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const tick = () => {
      const isComplete = !isDeleting && displayText === text;
      const isEmpty = isDeleting && displayText === '';

      if (isComplete) {
         // Pause at the end before deleting
        timeout = setTimeout(() => setIsDeleting(true), delay);
        return;
      }

      if (isEmpty) {
        setIsDeleting(false);
        timeout = setTimeout(() => {}, 500); // Small pause before restarting
        return;
      }

      const nextText = isDeleting
        ? text.substring(0, displayText.length - 1)
        : text.substring(0, displayText.length + 1);

      setDisplayText(nextText);
    };

    const currentSpeed = isDeleting ? speed / 2 : speed;
    timeout = setTimeout(tick, currentSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, text, speed, delay]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[2px] h-[0.8em] bg-blue-600 ml-1 align-middle"
      />
    </span>
  );
}
