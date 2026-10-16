import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  y = 24,
  sx = {},
  style = {},
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div style={{ width: '100%', ...style }}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
      style={{ width: '100%', ...style }}
    >
      {children}
    </motion.div>
  );
}
