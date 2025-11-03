import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <Hero />
            <Features />
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
}
