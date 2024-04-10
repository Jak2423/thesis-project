export default function GridPattern() {
   return (
      <svg
         className="absolute inset-0 -z-20 h-full w-full stroke-black/5 [mask-image:radial-gradient(75%_60%_at_top_center,white,transparent)] dark:stroke-white/5"
         aria-hidden="true"
      >
         <defs>
            <pattern
               id="hero"
               width="80"
               height="80"
               x="50%"
               y="-1"
               patternUnits="userSpaceOnUse"
            >
               <path d="M.5 200V.5H200" fill="none"></path>
            </pattern>
         </defs>
         <rect
            width="100%"
            height="100%"
            strokeWidth="0"
            fill="url(#hero)"
         ></rect>
      </svg>
   );
}