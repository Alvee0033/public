"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import Popover from "@/components/ui/Popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function AutocompleteField({
  label,
  items,
  value,
  onSelect,
  placeholder,
  displayKey = "name",
  searchKey = "name",
}) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const filteredItems = items.filter((item) =>
    typeof item[searchKey] === "string" &&
    item[searchKey].toLowerCase().includes(searchValue.toLowerCase())
  )

  const selectedItem = items.find((item) => item.id === value)

  return (
    <div className="space-y-2">
      <div>
        <Label>{label}</Label>
      </div>
      <Popover
        trigger={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedItem ? selectedItem[displayKey] : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
          </Button>
        }
      >
        <Command>
          <CommandInput
            placeholder={`Search ${label.toLowerCase()}...`}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList className="max-h-60 overflow-y-auto w-full">
            {/* <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty> */}
            <CommandGroup>
              <div className="max-h-60 overflow-y-auto w-full">
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item[searchKey]}
                    onSelect={() => {
                      onSelect(item.id === value ? null : item.id)
                      setOpen(false)
                      setSearchValue("")
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === item.id ? "opacity-100" : "opacity-0")} />
                    {item[displayKey]}
                    {item.email && <span className="ml-2 text-sm text-muted-foreground">({item.email})</span>}
                    {item.code && <span className="ml-2 text-sm text-muted-foreground">({item.code})</span>}
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </Popover>
    </div>
  )
}
