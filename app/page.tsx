import Validation from "@/components/validation";

export default function Home() {
   return (
      <>
         <div className="absolute -top-20 -z-10 hidden w-full justify-between lg:flex">
            <img src="/images/left.svg" />
            <img src="/images/right.svg" />
         </div>
         <main className="mx-auto w-full lg:max-w-screen-lg">
            <div className="my-4 flex w-full flex-col items-center justify-center px-8 lg:px-0">
               <h1 className="mb-24 max-w-[6em] text-center text-6xl  font-bold tracking-tight md:text-7xl lg:text-8xl">
                  License Validation
               </h1>
               <Validation />
            </div>
         </main>
      </>
   );
}
