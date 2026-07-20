import React from 'react'
import { Spinner } from './spinner'

interface LoaderProps {
    className?: string;
    spinnerClass?: string;
    size?: string;
}

export const Loader: React.FC<LoaderProps> = ({ className, spinnerClass, size }) => {
    return (
        <div className={`h-full w-full items-center justify-center flex ${className}`} >
            <Spinner className={spinnerClass} size={size} />
        </div>
    )
}
