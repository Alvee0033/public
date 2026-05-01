import { Card } from '@/components/ui/card';
import parseHtml from '@/lib/parseHtml';
import { AlertCircle, Book, Clock } from 'lucide-react';

export default function CurriculamTab({ course_modules }) {
    const isEmpty = !Array.isArray(course_modules) || course_modules.length === 0;

    return (
        <div>
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <AlertCircle className="w-8 h-8 mb-2" />
                    <span className="text-sm">Curriculum not found</span>
                </div>
            ) : (
                <div className="space-y-6">
                    {course_modules.map((module, index) => (
                        <Card key={module.id} className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">{module.title}</h3>
                                    <p className="text-gray-600 mb-4">
                                        {parseHtml(module.short_description)}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {module.duration} hours
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Book className="w-4 h-4" />
                                            {module.number_of_lessons ||
                                                module?.course_lessons?.length ||
                                                0}{" "}
                                            lessons
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
