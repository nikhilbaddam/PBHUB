import React, { useState } from 'react'
import AddWorker from "../components/AdminComponents/AddWorker";

const Workers = () => {



  return (
    <div  className='flex flex-wrap gap-6 p-4 bg-gray-100' >

        {/* Add Worker Component */}
  <div className="w-full md:w-1/2 lg:w-1/2">
    <AddWorker />
  </div>
        
        
    </div>
  )
}

export default Workers