declare module "@/components/ui/button" {
  import * as React from "react";

  export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: string;
    size?: string;
    asChild?: boolean;
  }

  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<any>
  >;

  export const buttonVariants: (...args: any[]) => string;
}

declare module "@/components/ui/badge" {
  import * as React from "react";

  export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: string;
  }

  export const Badge: React.ComponentType<BadgeProps>;
  export const badgeVariants: (...args: any[]) => string;
}

declare module "@/components/ui/input" {
  import * as React from "react";

  export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

  export const Input: React.ForwardRefExoticComponent<
    InputProps & React.RefAttributes<HTMLInputElement>
  >;
}

declare module "@/components/ui/select" {
  export const Select: any;
  export const SelectGroup: any;
  export const SelectValue: any;
  export const SelectTrigger: any;
  export const SelectContent: any;
  export const SelectLabel: any;
  export const SelectItem: any;
  export const SelectSeparator: any;
  export const SelectScrollUpButton: any;
  export const SelectScrollDownButton: any;
}
