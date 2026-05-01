import React from 'react'
import Button from '@/components/shared/buttons/Button'
import Link from 'next/link'

const CreateSesssionButton = () => {
    return (
        <div className="mt-10">
            <Link href="/lms/tutor-dashboard/sessions/session-create">
                <Button>+ Create session</Button>
            </Link>
        </div>
    )
}

export default CreateSesssionButton