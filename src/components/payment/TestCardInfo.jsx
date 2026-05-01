import { TEST_CARDS } from "@/constants/payment";

/**
 * TestCardInfo component to display test card information for development
 */
export const TestCardInfo = ({ isVisible = true }) => {
  if (!isVisible) return null;

  const testCardData = [
    {
      label: 'Success',
      number: TEST_CARDS.SUCCESS,
      description: 'Payment will succeed',
      color: 'text-green-700',
    },
    {
      label: 'Requires Auth',
      number: TEST_CARDS.REQUIRES_AUTH,
      description: 'Will require authentication',
      color: 'text-blue-700',
    },
    {
      label: 'Declined',
      number: TEST_CARDS.DECLINED,
      description: 'Payment will be declined',
      color: 'text-red-700',
    },
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <h4 className="font-medium text-blue-900">Test Card Numbers</h4>
      </div>
      
      <div className="space-y-2 text-sm">
        {testCardData.map((card, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className={card.color}>{card.label}:</span>
            <div className="text-right">
              <code className="font-mono text-blue-800 bg-blue-100 px-2 py-1 rounded text-xs">
                {card.number}
              </code>
              <div className="text-xs text-blue-600 mt-1">
                {card.description}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2 border-t border-blue-200">
        <p className="text-xs text-blue-600">
          <strong>Note:</strong> Use any future date for expiry (e.g., 12/25) and any 3 digits for CVC (e.g., 123)
        </p>
      </div>
    </div>
  );
};