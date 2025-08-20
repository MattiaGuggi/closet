import React from 'react'

type optionControllerType = {
    setThree: React.Dispatch<React.SetStateAction<boolean>>;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    buildOutfit: () => void;
};

const OptionController = ({ setThree, setIsModalOpen, buildOutfit }: optionControllerType) => {
  return (
    <div className='w-full h-full flex justify-end mr-40 my-16'>
        <div className='w-72 h-11/12 bg-gradient-to-br from-blue-500 to-indigo-700 flex flex-col items-center justify-center py-12 gap-7 rounded-2xl shadow-lg'>
            <h1 className='text-white font-semibold text-2xl mb-5'>Toggle model</h1>
            <label className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" value="" type="checkbox" />
                <div className="peer rounded-full outline-none duration-100 after:duration-500 w-12 h-6 bg-white
                    after:absolute after:outline-none after:rounded-full after:h-4 after:w-4
                    after:bg-blue-600 after:top-1 after:left-1 after:flex after:justify-center after:items-center  after:text-white after:font-bold
                    peer-checked:after:translate-x-5 peer-checked:after:border-blue-600"
                    onClick={() => setThree(prev => !prev)}
                >
                </div>
            </label>
            <button
                className='w-2/3 shadow-lg px-6 py-3 cursor-pointer rounded-xl font-semibold text-lg bg-white text-blue-600
                duration-200 transition-all hover:scale-105 hover:text-blue-700'
                onClick={() => setIsModalOpen(true)}
            >
                Import new item
            </button>
            <button
                className='w-2/3 shadow-lg px-6 py-3 cursor-pointer rounded-xl text-blue-600 bg-white duration-200 transition-all
                hover:scale-105 hover:text-blue-700 font-semibold text-lg'
                onClick={buildOutfit}
            >
                Build outfit
            </button>
        </div>
    </div>
  )
}

export default OptionController
