import { ShoppingCart, Calendar, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';

interface HotelHeaderProps {
  hotelName: string;
  onOpenCart: () => void;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const HotelHeader = ({ hotelName, onOpenCart, onOpenBooking, onOpenAdmin }: HotelHeaderProps) => {
  const { totalItems } = useCart();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {hotelName}
            </h1>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenBooking}
              className="text-foreground hover:text-primary"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Room
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenCart}
              className="text-foreground hover:text-primary relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {totalItems > 0 && (
                <Badge 
                  variant="default" 
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenAdmin}
              className="text-foreground hover:text-primary"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};