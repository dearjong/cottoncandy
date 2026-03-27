import Header from "./header";
import Footer from "./footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex min-h-0 flex-1 flex-col pt-[70px]">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}