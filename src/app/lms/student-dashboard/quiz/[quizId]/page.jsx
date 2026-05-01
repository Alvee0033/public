'use client';
import Button from '@/components/shared/buttons/Button';
import { ArrowLeft, Clock, FolderOpen } from 'lucide-react';

export default function QuizHeader() {
    // Dummy data for demonstration
    const quizTitle = 'Introduction to Advanced UX Design (Quiz)';
    const numQuestions = 10;
    const duration = 10; // in minutes
    const timer = '0:55:42';

    return (
        <>
            <div>
                <div
                    className="flex flex-col md:flex-row items-start md:items-center justify-between bg-[#f7f9fb] p-4 md:p-6 rounded-lg gap-4 md:gap-6 w-full"
                >
                    <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                        <button className="border-none bg-white h-14 w-14 flex items-center justify-center rounded-full shrink-0">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex-1 min-w-0">
                            <div className="font-inter font-medium text-[18px] leading-[24px] tracking-[0] truncate">
                                {quizTitle}
                            </div>
                            <div className="flex items-center gap-4 md:gap-6 mt-1 text-[#6b7280] text-[14px] flex-wrap">
                                <span className="flex gap-1 items-center">
                                    <FolderOpen className="text-blue-500 h-5 w-auto" />
                                    <span className="font-inter font-normal text-[14px] leading-[22px] tracking-[-0.01em] text-[#4E5566]">
                                        {numQuestions} Quiz
                                    </span>
                                </span>
                                <span className="flex gap-1 items-center">
                                    <Clock className="text-blue-500 h-5 w-auto" />
                                    <span className="font-inter font-normal text-[14px] leading-[22px] tracking-[-0.01em] text-[#4E5566]">
                                        {duration} min
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end">
                        <div
                            className="w-[65px] h-[65px] rounded-full flex items-center justify-center"
                            style={{
                                background: "linear-gradient(90.71deg, #682CE8 0.51%, #EE227F 105.72%)",
                            }}
                        >
                            <span className="font-roboto font-bold text-[10px] leading-[100%] tracking-[0] text-center align-middle text-[#682CE8] bg-white w-[56px] h-[56px] flex items-center justify-center rounded-full">
                                {timer}
                            </span>
                        </div>
                        <Button className="rounded-md cursor-pointer border-none">
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
