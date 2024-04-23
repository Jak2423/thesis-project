import Link from "next/link";

export default function Footer() {
   return (
      <footer className="flex w-full flex-col items-center justify-center bg-gray-200 py-10 dark:bg-gray-900">
         <ul className="mb-8 grid grid-cols-2  gap-x-4 gap-y-4 md:grid-cols-4 md:gap-x-6">
            <li className="list-none text-center hover:opacity-60 dark:text-gray-200">
               <Link href="#">Бидний тухай</Link>
            </li>
            <li className="list-none text-center hover:opacity-60 dark:text-gray-200">
               <Link href="#">Холбоо барих</Link>
            </li>
            <li className="list-none text-center hover:opacity-60 dark:text-gray-200">
               <Link href="#">Үйлчилгээний нөхцөл</Link>
            </li>
            <li className="list-none text-center hover:opacity-60 dark:text-gray-200">
               <Link href="#">Нууцлалын бодлого</Link>
            </li>
         </ul>
         <p className="text-sm font-thin text-gray-900 dark:text-gray-100">
            &copy; {new Date().getFullYear()} Designed & Built by Jak.
         </p>
      </footer>
   );
}
