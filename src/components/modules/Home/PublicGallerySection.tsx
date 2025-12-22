import { getPublicGallery } from "@/services/media/getPublicGallery";
import GalleryImageCard from "./PublicGalleryImageCard";

export default async function PublicGallerySection() {
  // Fetch gallery images
  const galleryResponse = await getPublicGallery(20, "photo");
  const images = galleryResponse.success ? galleryResponse.data || [] : [];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Explore Travel Moments
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing destinations and experiences from our community of
            travelers
          </p>
        </div>

        {/* Gallery Grid */}
        {images.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No gallery images available at the moment. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {images.map((image) => (
              <GalleryImageCard key={image.id} image={image} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
