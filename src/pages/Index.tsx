import { useState } from 'react';
import { useHotelData } from '@/hooks/useHotelData';
import { HotelHeader } from '@/components/HotelHeader';
import { HotelHero } from '@/components/HotelHero';
import { MenuSection } from '@/components/MenuSection';
import { Cart } from '@/components/Cart';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { hotelProfile, categories, products, loading } = useHotelData();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Checkout functionality will be implemented soon!",
    });
  };

  const handleOpenBooking = () => {
    toast({
      title: "Room Booking",
      description: "Room booking functionality will be implemented soon!",
    });
  };

  const handleOpenAdmin = () => {
    toast({
      title: "Admin Panel",
      description: "Admin panel will be implemented soon!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl">🏨</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Loading hotel data...</h2>
        </div>
      </div>
    );
  }

  const hotelName = hotelProfile?.name || 'Hotel Management System';
  const hotelDescription = hotelProfile?.description || 'Welcome to our luxury hotel experience.';

  return (
    <div className="min-h-screen bg-background">
      <HotelHeader
        hotelName={hotelName}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBooking={handleOpenBooking}
        onOpenAdmin={handleOpenAdmin}
      />
      
      <HotelHero 
        name={hotelName}
        description={hotelDescription}
      />
      
      <MenuSection 
        categories={categories}
        products={products}
      />
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Index;
