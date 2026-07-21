export default function TypingIndicator() {
  return (
    <div className='flex items-center gap-1.5 px-1 py-2' aria-label='AI is typing'>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className='h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce'
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}
