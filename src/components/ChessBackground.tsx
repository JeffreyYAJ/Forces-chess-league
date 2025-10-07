export default function ChessBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />

      <div className="absolute top-10 right-10 w-32 h-32 opacity-10">
        <svg viewBox="0 0 45 45" className="w-full h-full text-white">
          <g fill="currentColor" fillRule="evenodd" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z"/>
            <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/>
            <path d="M 25 8 A 2.5 2.5 0 1 1 20,8 A 2.5 2.5 0 1 1 25 8 z"/>
          </g>
        </svg>
      </div>

      <div className="absolute bottom-20 left-20 w-40 h-40 opacity-10">
        <svg viewBox="0 0 45 45" className="w-full h-full text-red-500">
          <g fill="currentColor" fillRule="evenodd" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 22.5,11.63 L 22.5,6" strokeLinejoin="miter"/>
            <path d="M 20,8 L 25,8" strokeLinejoin="miter"/>
            <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25"/>
            <path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37"/>
          </g>
        </svg>
      </div>

      <div className="absolute top-1/3 left-1/4 w-24 h-24 opacity-10">
        <svg viewBox="0 0 45 45" className="w-full h-full text-blue-500">
          <g fill="currentColor" fillRule="evenodd" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z"/>
            <path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z"/>
            <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14" stroke="currentColor"/>
            <path d="M 34,14 L 31,17 L 14,17 L 11,14"/>
            <path d="M 31,17 L 31,29.5 L 14,29.5 L 14,17" stroke="currentColor" strokeLinejoin="miter"/>
            <path d="M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5"/>
            <path d="M 11,14 L 34,14" fill="none" stroke="currentColor"/>
          </g>
        </svg>
      </div>

      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className={`${
                (Math.floor(i / 8) + (i % 8)) % 2 === 0 ? 'bg-white' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
