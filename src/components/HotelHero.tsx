interface HotelHeroProps {
  name: string;
  description: string;
}

export const HotelHero = ({ name, description }: HotelHeroProps) => {
  return (
    <section className="relative bg-gradient-to-br from-background via-muted/20 to-background py-20 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_theme(colors.primary)_0%,_transparent_50%)] opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_theme(colors.primary)_0%,_transparent_50%)] opacity-10" />
      
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          {name}
        </h1>
        
        <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full" />
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
        
        <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏨</span>
            </div>
            <h3 className="font-semibold text-foreground">Luxury Rooms</h3>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🍽️</span>
            </div>
            <h3 className="font-semibold text-foreground">Fine Dining</h3>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="font-semibold text-foreground">Premium Service</h3>
          </div>
        </div>
      </div>
    </section>
  );
};