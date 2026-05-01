import { Card, CardContent } from '@/components/ui/card';

const WidgetCard = ({ title, data, renderItem, bgColor, listClassName }) => {
    // Helper: convert title like "My upcoming session" => "No upcoming session"
    const getEmptyMessage = (title) => {
        const match = title.match(/my (.+)/i);
        if (match) {
            return `No ${match[1]}`;
        }
        return 'No data';
    };

    return (
        <div
            className={`w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto p-0 shadow-lg rounded-2xl hover:shadow-2xl transition-shadow mb-6 border border-purple-100 flex-1 min-w-0 ${bgColor ? bgColor : 'bg-gradient-to-tr from-white to-purple-100'
                }`}
        >
            <div className="flex items-center justify-between px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
                <span className="text-lg sm:text-xl font-semibold text-gray-800 tracking-tight break-words">{title}</span>
            </div>
            <Card className="w-full h-full flex bg-white rounded-b-2xl">
                <CardContent className="flex flex-col space-y-2 p-3 sm:p-4 md:p-6">
                    {Array.isArray(data) ? (
                        data.length > 0 ? (
                            <ul className={`space-y-3 ${listClassName || ''}`}>
                                {data.map((item, idx) =>
                                    renderItem ? renderItem(item, idx) : (
                                        <li key={idx} className="flex flex-row flex-wrap gap-x-4 gap-y-1 items-center bg-purple-50 rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-sm hover:bg-purple-100 transition-colors">
                                            {Object.keys(item).map(key => (
                                                <span key={key} className="inline-flex items-center text-xs sm:text-sm text-gray-700 font-medium capitalize whitespace-nowrap">
                                                    <span className="mr-1 text-gray-500">{key}:</span> <span className="font-normal text-gray-600">{item[key]}</span>
                                                </span>
                                            ))}
                                        </li>
                                    )
                                )}
                            </ul>
                        ) : (
                            <span className="text-base text-gray-400 text-center py-6">
                                {getEmptyMessage(title)} {/* 👈 Dynamic empty message */}
                            </span>
                        )
                    ) : (
                        <span className="text-base sm:text-lg text-blue-700 font-bold text-center py-6">{data}</span>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default WidgetCard;
