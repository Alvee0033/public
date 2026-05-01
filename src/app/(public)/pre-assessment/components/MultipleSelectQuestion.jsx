"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

export default function MultipleSelectQuestion({ question, index }) {
    const { control, watch } = useFormContext();
    const fieldName = `questions.${index}.answer`;

    return (
        <div className="space-y-4 mb-6 p-4 border border-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold">{question.question}</h3>

            <FormField
                control={control}
                name={fieldName}
                render={({ field }) => {
                    // Ensure field.value is always an array
                    const value = Array.isArray(field.value) ? field.value : [];

                    return (
                        <FormItem className="space-y-3">
                            <FormControl>
                                <div className="space-y-2">
                                    {question.options.map((option, i) => (
                                        <div className="flex items-center space-x-2" key={i}>
                                            <Checkbox
                                                id={`${fieldName}-option-${i}`}
                                                checked={value.includes(option)}
                                                onCheckedChange={(checked) => {
                                                    const updatedValue = checked
                                                        ? [...value, option]
                                                        : value.filter(item => item !== option);
                                                    field.onChange(updatedValue);
                                                }}
                                            />
                                            <FormLabel
                                                htmlFor={`${fieldName}-option-${i}`}
                                                className="font-normal cursor-pointer"
                                            >
                                                {option}
                                            </FormLabel>
                                        </div>
                                    ))}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
        </div>
    );
}