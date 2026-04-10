"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  UseDeleteFiatWalletSavedCard,
  UseFundFiatWalletSavedCard,
} from "@/lib/services/wallet.service";

interface Props {
  cards: any[];
  amount: number;
  onBack: () => void;
  onAddNew: () => void;
}

export const SavedCardsList = ({ cards, amount, onBack, onAddNew }: Props) => {
  const { mutate: chargeCard, isPending } = UseFundFiatWalletSavedCard();
  const { mutate: deleteCard } = UseDeleteFiatWalletSavedCard();

  // ✅ track selected card
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  useEffect(() => {
    if (cards.length > 0) {
      setSelectedCardId(cards[0].id);
    }
  }, [cards]);

  const handleCharge = () => {
    if (!selectedCardId) return;

    chargeCard({
      amount,
      savedCardId: selectedCardId,
    });
  };

  return (
    <div className="space-y-4">
      {/* 🔙 Back */}
      <Button variant="outline" onClick={onBack}>
        Back
      </Button>

      <h2 className="text-lg font-semibold">Select Saved Card</h2>

      {/* 🔹 Cards */}
      {cards.map((card) => {
        const isSelected = selectedCardId === card.id;

        return (
          <div
            key={card.id}
            onClick={() => setSelectedCardId(card.id)}
            className={`border rounded-lg p-4 flex justify-between items-center cursor-pointer transition
              ${isSelected ? "border-black bg-gray-50" : "border-gray-200"}
            `}
          >
            <div>
              <p className="font-medium">
                {card.brand} **** {card.last4}
              </p>
              <p className="text-sm text-gray-500">
                Exp: {card.expMonth}/{card.expYear}
              </p>
            </div>

            {/* ❌ removed pay button here */}
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation(); // ✅ prevent selecting card
                deleteCard(card.id);
              }}
            >
              Delete
            </Button>
          </div>
        );
      })}

      {/* 💳 Charge button */}
      <Button
        className="w-full"
        disabled={!selectedCardId || isPending}
        onClick={handleCharge}
      >
        {isPending ? "Processing..." : `Charge ₦${amount.toLocaleString()}`}
      </Button>

      {/* ➕ Add new card */}
      <Button variant="outline" onClick={onAddNew} className="w-full">
        Use a new card
      </Button>
    </div>
  );
};
