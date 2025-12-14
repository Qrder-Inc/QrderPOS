"use client";

// This Component is a reusable product card 
// that displays product information and allows 
// for custom content via children prop.


interface CardProps {
  title: string;
  category: string;
  price: number;
}

export default function ProductCard({
  title,
  category,
  price,
}: CardProps) {
  return (
    <>
    <div className="aspect-square bg-gray-200 rounded-md mb-3 flex items-center justify-center">
        <span className="text-4xl">🍽️</span>
    </div>
    <h3 className="font-semibold text-sm mb-1">{title}</h3>
    <p className="text-xs text-gray-500 mb-2">{category}</p>
    <p className="text-lg font-bold text-[#ff8f2e]">₡{price.toFixed(2)}</p>
    </>
  );
}