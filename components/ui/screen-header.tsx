export default function ScreenHeader({ title }: { title: string }) {
   return (
      <h1 className="mb-8 flex items-center text-2xl font-bold">{title}</h1>
   );
}
