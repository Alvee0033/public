"use client";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import Popover from "@/components/ui/Popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
export function Combobox({ options, value, onChange, placeholder = "Select..." }) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const filtered = search
        ? options.filter(option => option.toLowerCase().includes(search.toLowerCase()))
        : options;

    return (
        <Popover
            trigger={
                <button
                    type="button"
                    className={cn(
                        "w-full flex items-center justify-between border rounded px-3 py-2 bg-white text-left",
                        !value && "text-muted-foreground"
                    )}
                >
                    {value || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
            }
        >
            <Command>
                <CommandInput
                    placeholder={placeholder}
                    value={search}
                    onValueChange={setSearch}
                    autoFocus
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                        {filtered.map(option => (
                            <CommandItem
                                key={option}
                                value={option}
                                onSelect={() => {
                                    if (typeof onChange === "function") {
                                        onChange(option);
                                    }
                                    setOpen(false);
                                    setSearch("");
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </Popover>
    );
}
