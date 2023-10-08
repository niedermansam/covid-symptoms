import React from 'react'

function layout({children}: {
    children: React.ReactNode
    }) {
    return (
        <div className='pb-12 md:pb-24'>
        {children}
        </div>
    )
}

export default layout