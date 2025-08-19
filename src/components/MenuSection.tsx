import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Product, Category } from '@/hooks/useHotelData';
import { toast } from '@/hooks/use-toast';

interface MenuSectionProps {
  categories: Category[];
  products: Product[];
}

export const MenuSection = ({ categories, products }: MenuSectionProps) => {
  const { addItem, items, updateQuantity } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => product.category_id === categoryId);
  };

  const getItemQuantity = (productId: string) => {
    const cartItem = items.find(item => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    addItem(product, quantity);
    toast({
      title: "Added to cart",
      description: `${product.name} (${quantity}) added to your cart.`,
    });
    setQuantities({ ...quantities, [product.id]: 1 });
  };

  const handleQuantityChange = (productId: string, change: number) => {
    const currentQuantity = quantities[productId] || 1;
    const newQuantity = Math.max(1, currentQuantity + change);
    setQuantities({ ...quantities, [productId]: newQuantity });
  };

  const handleCartQuantityChange = (productId: string, change: number) => {
    const currentQuantity = getItemQuantity(productId);
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    } else {
      updateQuantity(productId, 0);
    }
  };

  if (categories.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Our Menu</h2>
          <p className="text-muted-foreground">Menu items will be available soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Our Menu</h2>
        
        {categories.map(category => {
          const categoryProducts = getProductsByCategory(category.id);
          
          if (categoryProducts.length === 0) return null;
          
          return (
            <div key={category.id} className="mb-16">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-2 text-foreground">{category.name}</h3>
                {category.description && (
                  <p className="text-muted-foreground text-lg">{category.description}</p>
                )}
                <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map(product => {
                  const currentQuantity = quantities[product.id] || 1;
                  const cartQuantity = getItemQuantity(product.id);
                  
                  return (
                    <Card key={product.id} className="bg-card border-border hover:border-primary/50 transition-colors group">
                      {product.image_url && (
                        <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-foreground">{product.name}</CardTitle>
                          <Badge variant="outline" className="text-primary border-primary">
                            ${product.price.toFixed(2)}
                          </Badge>
                        </div>
                        {product.description && (
                          <CardDescription className="text-muted-foreground">
                            {product.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      
                      <CardContent>
                        {cartQuantity > 0 ? (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">In cart: {cartQuantity}</span>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCartQuantityChange(product.id, -1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center">{cartQuantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCartQuantityChange(product.id, 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityChange(product.id, -1)}
                                disabled={currentQuantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center text-foreground">{currentQuantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuantityChange(product.id, 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            <Button 
                              onClick={() => handleAddToCart(product)}
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              Add to Cart
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};