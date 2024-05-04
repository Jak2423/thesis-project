import Link from "next/link";
import { FaFacebook, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const footerLinks = [
   {
      name: "Бидний тухай",
      href: "#",
   },
   {
      name: "Холбоо барих",
      href: "#",
   },
   {
      name: "Үйлчилгээний нөхцөл",
      href: "#",
   },
   {
      name: "Нууцлалын бодлого",
      href: "#",
   },
];

const footerSocials = [
   {
      name: "Facebook",
      href: "#",
      icon: FaFacebook,
   },
   {
      name: "Twitter",
      href: "#",
      icon: FaXTwitter,
   },
   {
      name: "LinkedIn",
      href: "#",
      icon: FaLinkedin,
   },
   {
      name: "Github",
      href: "#",
      icon: FaGithub,
   },
];

export default function Footer() {
   return (
      <footer className="flex w-full flex-col items-center justify-center border-t border-gray-200 py-12  dark:border-gray-800 ">
         <ul className="mb-8 grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4 md:gap-x-6">
            {footerLinks.map((l, i) => (
               <li
                  key={i}
                  className="list-none text-center text-sm text-gray-500 transition-all duration-300  ease-linear hover:text-gray-950 dark:text-gray-300 hover:dark:text-gray-50"
               >
                  <Link href={l.href}>{l.name}</Link>
               </li>
            ))}
         </ul>
         <ul className="mb-16 flex items-center gap-x-8">
            {footerSocials.map((s) => (
               <li
                  key={s.name}
                  className="list-none text-center text-sm text-gray-500 transition-all duration-300  ease-linear hover:text-gray-950 dark:text-gray-300 hover:dark:text-gray-50"
               >
                  <Link href={s.href}>
                     <s.icon className="size-5" />
                  </Link>
               </li>
            ))}
         </ul>
         <p className="text-sm font-extralight text-gray-700 dark:text-gray-300 ">
            &copy; {new Date().getFullYear()} Designed & Built by
            <a
               href="https://github.com/Jak2423"
               target="_blank"
               rel="noopener noreferrer"
            >
               <span className="hover:text-sem ml-1 transition-all duration-300 ease-linear hover:text-gray-950   hover:dark:text-gray-50">
                  Jak.
               </span>
            </a>
         </p>
      </footer>
   );
}
