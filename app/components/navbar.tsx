import Link from "next/link";

export default function Navbar() {
   return (
      <nav className="flex w-full flex-col justify-center py-8">
         <div className="mx-auto flex w-full items-center justify-between lg:max-w-screen-lg ">
            <Link href={"/"} className="inline-block ">
               <span className="text-lg font-semibold uppercase tracking-widest  opacity-80">
                  LICENS
               </span>
            </Link>
            <Link
               href={"/"}
               className="rounded-lg border border-gray-200 px-4 py-2 opacity-80"
            >
               <span>Нэвтрэх</span>
            </Link>
         </div>
      </nav>
   );
}
