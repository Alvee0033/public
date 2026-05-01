"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormContext } from "react-hook-form";

export default function MultipleChoiceQuestion({ question, index }) {
    const { control } = useFormContext();
    const fieldName = `questions.${index}.answer`;

    return (
        <div className="space-y-4 mb-6 p-4 border border-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold">{question.question}</h3>

            <FormField
                control={control}
                name={fieldName}
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value || ""}
                            >
                                {question.options.map((option, i) => (
                                    <div className="flex items-center space-x-2 p-2" key={i}>
                                        <RadioGroupItem id={`${fieldName}-option-${i}`} value={option} />
                                        <FormLabel htmlFor={`${fieldName}-option-${i}`} className="font-normal">
                                            {option}
                                        </FormLabel>
                                    </div>
                                ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}