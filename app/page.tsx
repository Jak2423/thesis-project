import Validation from "@/components/validation";

export default function Home() {
   return (
      <main className="mx-auto w-full lg:max-w-screen-lg">
         <div className="my-4 flex w-full flex-col items-center justify-center">
            <h1 className="mb-24 max-w-[6em] text-center font-bold  tracking-tight lg:text-8xl">
               License Validation
            </h1>
            <Validation />
         </div>
      </main>
   );
}
