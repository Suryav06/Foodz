import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Error1 from '../Err/Error1';

function Saved() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const userEmail = sessionStorage.getItem('userEmail');
        if (!userEmail) {
          setLoading(false);
          return;
        }
        const response = await axios.get('http://localhost:4000/savedRecipes', {
          params: {
            email: userEmail
          }
        });
        setSavedRecipes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
        setError('Error fetching saved recipes. Please try again later.');
        setLoading(false);
      }
    };
    fetchSavedRecipes();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/savedRecipes/${id}`);
      setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== id));
    } catch (error) {
      console.error('Error removing saved recipe:', error);
      setError('Error removing saved recipe. Please try again later.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || savedRecipes.length === 0) {
    return <Error1/>;
  }

  return (
    <div className=" mx-auto px-4 bg-green-900 ">
      <h2 className="text-2xl font-semibold mb-4 text-lime-600">Saved Recipes</h2>
      <div className="overflow-x-auto">
        <table className="w-full sm:w-auto border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-1/5 sm:w-1/6 py-3 px-4 uppercase text-sm font-medium text-gray-600">Image</th>
              <th className="w-2/5 sm:w-2/6 py-3 px-4 uppercase text-sm font-medium text-gray-600">Title</th>
              <th className="w-1/5 sm:w-1/6 py-3 px-4 uppercase text-sm font-medium text-gray-600">Ingredients</th>
              <th className="w-1/5 sm:w-1/6 py-3 px-4 uppercase text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {savedRecipes.map((recipe) => (
              <tr key={recipe._id}>
                <td className="border py-3 px-4">
                  <img src={recipe.image} alt={recipe.title} className="w-24 h-24 sm:w-16 sm:h-16 object-cover" />
                </td>
                <td className="border py-3 px-4">{recipe.title}</td>
                <td className="border py-3 px-4">{recipe.ingredients.join(', ')}</td>
                <td className="border py-3 px-4">
                  <button
                    onClick={() => handleRemove(recipe._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 5.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Saved;
