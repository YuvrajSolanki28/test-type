import React from 'react'
import { motion } from 'framer-motion'
interface LoadingProps {
  variant?: 'fullscreen' | 'inline' | 'button'
  text?: string
  size?: 'sm' | 'md' | 'lg'
}
export function Loading({
  variant = 'inline',
  text,
  size = 'md',
}: LoadingProps) {
  if (variant === 'fullscreen') {
    return <FullscreenLoader text={text} />
  }
  if (variant === 'button') {
    return <ButtonLoader size={size} />
  }
  return <InlineLoader text={text} size={size} />
}
function FullscreenLoader({ text }: { text?: string }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f]"
    >
      {/* Animated background orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"
      />

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo with pulse */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/50">
            <span className="text-white font-bold text-3xl">T</span>
          </div>

          {/* Rotating ring */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0%, rgba(59, 130, 246, 0.5) 50%, transparent 100%)',
              padding: '2px',
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        </motion.div>

        {/* Animated dots */}
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -12, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-linear-to-r from-blue-400 to-purple-400"
            />
          ))}
        </div>

        {/* Loading text */}
        {text && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="text-white/60 text-lg"
          >
            {text.split('').map((char, i) => (
              <motion.span
                key={i}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.1,
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
function InlineLoader({
  text,
  size,
}: {
  text?: string
  size: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          className={`${sizeClasses[size]} rounded-full`}
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0%, rgba(59, 130, 246, 0.8) 50%, transparent 100%)',
            padding: '2px',
          }}
        >
          <div className="w-full h-full rounded-full bg-[#0a0a0f]" />
        </motion.div>

        {/* Inner pulsing circle */}
        <motion.div
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-1/2 h-1/2 rounded-full bg-linear-to-br from-blue-400 to-purple-400" />
        </motion.div>
      </div>

      {text && (
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="text-white/60 text-sm"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}
function ButtonLoader({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }
  return (
    <motion.div
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={`${sizeClasses[size]} rounded-full border-2 border-white/20 border-t-white`}
    />
  )
}
// Skeleton loader for content
export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`bg-white/5 rounded-xl ${className}`}
    />
  )
}
// Pulse loader for cards
export function PulseLoader({
  children,
  isLoading,
}: {
  children: React.ReactNode
  isLoading: boolean
}) {
  if (!isLoading) return <>{children}</>
  return (
    <motion.div
      animate={{
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}
