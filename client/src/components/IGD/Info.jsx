import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router

function Info() {
  const [selectedMeal, setSelectedMeal] = useState("Lunch");
  const history = useNavigate();

  const radios = [
    {
        name: "Breakfast",
        description: "Start your day with a nutritious and delicious breakfast.",
    },
    {
        name: "Lunch",
        description: "Fuel your afternoon with a satisfying and energizing lunch.",
    },
    {
        name: "Dinner",
        description: "End your day with a hearty and comforting dinner.",
    },
  ];

  const handleNext = () => {
    history({
      pathname: '/ing', 
      state: { meal: selectedMeal }
    });
  };

  return (
    <>
    <div className='bg-green-900 p-9'>
    <div className="max-w-md mx-auto px-4 ">
        <h2 className="text-lime-600 font-medium">Choose what you're planning to make</h2>

        <ul className="mt-6 space-y-3">
            {radios.map((item, idx) => (
                <li key={idx}>
                    <label htmlFor={item.name} className="block relative">
                        <input 
                          id={item.name} 
                          type="radio" 
                          checked={selectedMeal === item.name}
                          onChange={() => setSelectedMeal(item.name)}
                          name="meal" 
                          className="sr-only peer" 
                        />
                        <div className="w-full p-5 cursor-pointer rounded-lg border bg-lime-600 shadow-sm ring-white peer-checked:ring-2 duration-200">
                            <div className="pl-7">
                                <h3 className="leading-none text-green-900 font-medium">
                                    {item.name}
                                </h3>
                                <p className="mt-1 text-sm text-white">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                        <span className="block absolute top-5 left-5 border peer-checked:border-[5px] peer-checked:border-indigo-600 w-4 h-4 rounded-full">
                        </span>
                    </label>
                </li>
            ))}
        </ul>
        <button 
          onClick={handleNext} 
          className="mt-6  bg-lime-600 hover:bg-lime-900 text-white font-bold py-2 px-4 rounded"
        >
          Next
        </button>
    </div>
  </div>
  </>
  );
}

export default Info;
