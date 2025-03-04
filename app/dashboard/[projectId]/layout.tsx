import MenuBar from "@/components/menu/menubar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-screen flex flex-col pl-4 pr-4 pb-4">
      <MenuBar />
      {children}
    </div>
  );
}
