"use client";

export function Command({ children }) {
    return <div>{children}</div>;
}
export function CommandInput({ placeholder, value, onValueChange, autoFocus }) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={e => onValueChange(e.target.value)}
            autoFocus={autoFocus}
            className="w-full border-b px-2 py-1 mb-2 outline-none"
        />
    );
}
export function CommandList({ children }) {
    return <div>{children}</div>;
}
export function CommandEmpty({ children }) {
    return <div className="text-gray-400 px-2 py-1">{children}</div>;
}
export function CommandGroup({ children }) {
    return <div>{children}</div>;
}
export function CommandItem({ value, onSelect, children }) {
    return (
        <div
            className="px-2 py-1 cursor-pointer hover:bg-gray-100 flex items-center"
            onClick={() => onSelect(value)}
        >
            {children}
        </div>
    );
}
