import React from 'react'
import CreateGroupButton from './_components/CreateGroupButton'
import GroupLoad from './_components/GroupLoad'

const page = () => {
  return (
     <div className="container mx-auto px-4 py-6 max-w-7xl">
       <div className="flex justify-end mb-6">
        <CreateGroupButton />
      </div>
      <GroupLoad />
    </div>
  )
}

export default page