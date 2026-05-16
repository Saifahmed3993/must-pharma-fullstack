import React, { createContext, useContext, useState, useEffect } from "react";
import agent from "../api/agent";
import type { Basket } from "../models/basket";

const BASKET_URL = "/basket";

interface BasketContextType {
  basket: Basket | null;
  addItemToBasket: (product: any, quantity?: number) => Promise<void>;
  removeItemFromBasket: (id: number) => Promise<void>;
  incrementItemQuantity: (id: number) => Promise<void>;
  decrementItemQuantity: (id: number) => Promise<void>;
  clearBasket: () => void;
  basketTotal: number;
  basketCount: number;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider = ({ children }: { children: React.ReactNode }) => {
  const [basket, setBasket] = useState<Basket | null>(null);

  // جلب السلة عند فتح الأبلكيشن
  useEffect(() => {
    const fetchBasket = async () => {
      const basketId = localStorage.getItem("basket_id");
      if (basketId) {
        try {
          const res = await agent.get(`${BASKET_URL}?id=${basketId}`);
          setBasket(res ?? null);
        } catch (error) {
          console.error("Error fetching basket:", error);
          localStorage.removeItem("basket_id");
        }
      }
    };
    fetchBasket();
  }, []);

  const updateBasket = async (updatedBasket: Basket) => {
    try {
      await agent.post(BASKET_URL, updatedBasket);
      setBasket(updatedBasket);
    } catch (error) {
      console.error("Error updating basket:", error);
    }
  };

  const addItemToBasket = async (product: any, quantity = 1) => {
    let currentBasket = basket;

    if (!currentBasket) {
      const newId = crypto.randomUUID();
      localStorage.setItem("basket_id", newId);
      currentBasket = { id: newId, items: [] };
    }

    const items = [...currentBasket.items];
    const itemIndex = items.findIndex(i => i.id === product.id);

    if (itemIndex === -1) {
      const discountedPrice = product.discountPercentage && product.discountPercentage > 0
        ? product.price - (product.price * (product.discountPercentage / 100))
        : product.price;

      items.push({
        id: product.id,
        productName: product.name,
        price: discountedPrice,
        quantity,
        pictureUrl: product.pictureUrl,
        brand: product.productBrand,
        type: product.productType
      });
    } else {
      items[itemIndex].quantity += quantity;
    }

    await updateBasket({ ...currentBasket, items });
  };

  const removeItemFromBasket = async (id: number) => {
    if (!basket) return;
    const items = basket.items.filter(i => i.id !== id);
    await updateBasket({ ...basket, items });
  };

  const incrementItemQuantity = async (id: number) => {
    if (!basket) return;
    const items = [...basket.items];
    const itemIndex = items.findIndex(i => i.id === id);
    if (itemIndex !== -1) {
      items[itemIndex].quantity++;
      await updateBasket({ ...basket, items });
    }
  };

  const decrementItemQuantity = async (id: number) => {
    if (!basket) return;
    const items = [...basket.items];
    const itemIndex = items.findIndex(i => i.id === id);
    if (itemIndex !== -1) {
      if (items[itemIndex].quantity > 1) {
        items[itemIndex].quantity--;
        await updateBasket({ ...basket, items });
      } else {
        await removeItemFromBasket(id);
      }
    }
  };

  const clearBasket = () => {
    localStorage.removeItem("basket_id");
    setBasket(null);
  };

  const basketTotal = basket?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
  const basketCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <BasketContext.Provider value={{
      basket,
      addItemToBasket,
      removeItemFromBasket,
      incrementItemQuantity,
      decrementItemQuantity,
      clearBasket,
      basketTotal,
      basketCount
    }}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) throw new Error("useBasket must be used within a BasketProvider");
  return context;
};
