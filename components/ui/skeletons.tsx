const shimmer =
   "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:dark:via-gray-800/40  before:via-gray-200/40 before:to-transparent";

export function CardSkeleton() {
   return (
      <div
         className={`${shimmer} relative flex w-full items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-6  shadow dark:border-gray-800 dark:bg-gray-950`}
      >
         <div className="flex flex-col space-y-1.5 p-0">
            <div className="h-5 w-5 rounded-md bg-gray-100 dark:bg-gray-900" />
            <div className="h-6 w-20 rounded-md bg-gray-100 dark:bg-gray-900" />
         </div>
         <div className="grid size-12 place-content-center rounded-full border border-gray-200 bg-gray-100 shadow dark:border-gray-800 dark:bg-gray-900 " />
      </div>
   );
}

export function CardsSkeleton() {
   return (
      <>
         <CardSkeleton />
         <CardSkeleton />
         <CardSkeleton />
         <CardSkeleton />
      </>
   );
}
