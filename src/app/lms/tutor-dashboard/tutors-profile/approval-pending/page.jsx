import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const Page = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <Card className="w-full max-w-md bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl shadow-xl">
                <CardHeader className="flex flex-col items-center space-y-2">
                    <Clock className="w-10 h-10" />
                    <CardTitle className="text-2xl font-bold text-center">
                        Profile Approval Pending
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-base leading-relaxed">
                        Your profile is currently under review. You will be notified once it is approved.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
