import React from 'react'
import Button from '@/components/shared/buttons/Button'
import Link from 'next/link'

const CreateGroupButton = () => {
    return (
        <div className="flex gap-4">
            <Link href="/lms/tutor-dashboard/sessions/create-group">
                <Button>+ Create Group Session</Button>
            </Link>
        </div>
    )
}

export default CreateGroupButton