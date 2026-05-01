import { Card, CardContent } from '@/components/ui/card';

const StatusCard = ({ title, data }) => {
    return (
        <div className="w-full max-w-full sm:max-w-xs md:max-w-sm mx-auto px-2 sm:px-0 flex-1 min-w-0">
            <Card className="w-full h-full bg-gradient-to-tr from-white to-purple-100 shadow-lg rounded-2xl hover:shadow-2xl transition-shadow border border-purple-100">
                <CardContent className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-6">
                    <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 text-center break-words">{title}</span>
                    <span className="text-lg xs:text-xl sm:text-2xl md:text-3xl text-purple-700 font-bold text-center break-words">{data}</span>
                </CardContent>
            </Card>
        </div>
    );
};

export default StatusCard;
