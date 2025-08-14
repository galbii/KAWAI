import { 
  Hero,
  NewsCarousel, 
  PianoGallery,
  PianoCollection, 
  ContactForm,
  ShowroomLocation
} from "@/components/homepage";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <PianoCollection />
      <NewsCarousel />
      <PianoGallery />
      <ContactForm />
      <ShowroomLocation />
    </div>
  );
}