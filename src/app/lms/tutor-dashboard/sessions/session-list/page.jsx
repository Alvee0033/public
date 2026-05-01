import React from 'react'
import CreateSesssionButton from './_components/CreateSesssionButton'
import SessionLoad from './_components/SessionLoad'

const page = () => {

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex justify-end mb-6">
                <CreateSesssionButton />
            </div>
            <div>
                <SessionLoad />
            </div>
        </div>
    )
}

export default page