"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

export default function TrueFalseQuestion({ question, index }) {
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
                            <div className="flex gap-4 justify-center">
                                <Button
                                    type="button"
                                    variant={field.value === true ? "default" : "outline"}
                                    onClick={() => field.onChange(true)}
                                    className="min-w-[100px]"
                                >
                                    <FormLabel className="m-0 cursor-pointer font-normal">True</FormLabel>
                                </Button>
                                <Button
                                    type="button"
                                    variant={field.value === false ? "default" : "outline"}
                                    onClick={() => field.onChange(false)}
                                    className="min-w-[100px]"
                                >
                                    <FormLabel className="m-0 cursor-pointer font-normal">False</FormLabel>
                                </Button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}