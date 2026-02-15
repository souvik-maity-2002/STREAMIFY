import React from 'react'
import { LoaderIcon } from "lucide-react";

const PageLoader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
        </div>
    )
    }

export default PageLoader;
