import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Search({ placeholder }: { placeholder: string }) {
   const searchParams = useSearchParams();
   const pathname = usePathname();
   const { replace } = useRouter();

   const handleSearch = (term: string) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
         params.set("query", term);
      } else {
         params.delete("query");
      }
      replace(`${pathname}?${params.toString()}`);
   };

   return (
      <form className="relative w-full flex-1">
         <input
            className="w-full rounded-md border border-gray-200 bg-transparent py-2 pl-4 pr-10 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300 "
            type="text"
            placeholder={placeholder}
            defaultValue={searchParams.get("query")?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
         />
         <button className="absolute right-0 top-0 flex h-full items-center justify-center px-2">
            <MagnifyingGlassIcon className="size-6 text-gray-300 dark:text-gray-600" />
         </button>
      </form>
   );
}
