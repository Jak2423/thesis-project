import SideNav from "@/components/sidenav";
import Header from "../../components/header";

export default function Layout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <div className="relative flex h-full min-h-screen w-full">
         <div className="h-full flex-none lg:z-50 lg:w-72">
            <SideNav />
         </div>
         <div className="flex w-full flex-col">
            <Header />
            {children}
         </div>
      </div>
   );
}
