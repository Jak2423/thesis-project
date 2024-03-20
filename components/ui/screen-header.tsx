export default function ScreenHeader({ title }: { title: string }) {
   return (
      <h1 className="text-bold mb-8 flex items-center text-2xl">{title}</h1>
   );
}
