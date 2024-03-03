const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Home() {
   return (
      <main className="mx-auto w-full  lg:max-w-screen-lg">
         <div className="my-4 flex w-full flex-col items-center justify-center">
            <h1 className="mb-24 max-w-[6em] text-center font-bold  tracking-tight lg:text-8xl">
               License Validation
            </h1>
            <div className="relative w-full  lg:w-2/3">
               <input
                  type="text"
                  className="block w-full rounded-lg bg-gray-900 p-4 text-lg font-medium  text-white placeholder-gray-400 outline-none transition-all duration-100 ease-in hover:ring-1 hover:ring-gray-800"
                  placeholder="Лицензийн Дугаар"
                  required
               />
               <button className="absolute bottom-2.5 end-2.5 top-2.5 rounded-lg bg-gray-800 px-4 py-2 hover:opacity-80">
                  Шалгах
               </button>
            </div>
         </div>
      </main>
   );
}
