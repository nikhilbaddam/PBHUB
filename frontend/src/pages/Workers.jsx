import React, { useState } from 'react'
import AddWorker from "../components/WorkerComponents/AddWorker";
import GetAllworkers from '../components/WorkerComponents/GetAllworkers';

const Workers = () => {



  return (
    <div  className='flex flex-wrap gap-6 p-4 bg-gray-100' >

        {/* Add Worker Component */}
  <div className="w-full md:w-1/2 lg:w-1/2">
    <AddWorker />
  </div>
        {/* <div className="w-full md:w-1/2 lg:w-1/3" >
        <GetAllworkers/>
        </div> */}
        
    </div>
  )
}

export default Workers