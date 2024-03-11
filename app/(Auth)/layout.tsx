import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home - SyncSketch",
    description: "SyncSketch - Online Collaborative Whiteboard",
};

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="flex items-center justify-center h-full bg-slate-500">
            {/* 
            for mobile screens: w-11/12(91%)
            for medium screens: md:w-3/4(75%)
            for large screens: lg:w-2/5(40%)
            */}
            <main className="flex items-center bg-white rounded-lg h-fit md:h-auto md:aspect-square md:w-3/4 lg:w-2/5  w-11/12 p-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold  mb-3 md:mb-4">
                        Welcome to SynchSketch
                    </h1>
                    <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">
                        Your platform for online collaboration! Empower your
                        team with synchronized sketching and brainstorming.
                    </p>
                    {children}
                </div>
            </main>
        </section>
    );
}
