import { cn } from '@/utils';
import React from 'react'

type TitleProps ={
    title: string;
    className?: string
}
export function Title({title, className}:TitleProps) {
  return (
<h4 className={cn("text-white text-lg font-medium", className)}>{title}</h4>
  )
}
