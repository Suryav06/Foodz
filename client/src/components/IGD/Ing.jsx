import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Popover, Transition } from '@headlessui/react';

function Ing() {
  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [expandedRecipeIndex, setExpandedRecipeIndex] = useState(null);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    if (ingredient.trim()) {
      setIngredients([...ingredients, ingredient]);
      setIngredient('');
    }
  };

  const handleDelete = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const fetchRecipeDetails = async (recipeId) => {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
        params: {
          includeNutrition: true,
          apiKey: 'af6fe5a85b7d4629b07179c4c58dcf13'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipe details for ID ${recipeId}:`, error);
      return null;
    }
  };

  const fetchRecipes = async () => {
    setIsLoading(true);  // Set loading to true when starting the fetch
    try {
      const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
        params: {
          ingredients: ingredients.join(','),
          number: 5,
          apiKey: 'af6fe5a85b7d4629b07179c4c58dcf13'
        }
      });

      const recipeDetails = await Promise.all(response.data.map(recipe => fetchRecipeDetails(recipe.id)));
      setError(null);
      setRecipes(recipeDetails.filter(recipe => recipe !== null));
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Error fetching recipes. Please try again later.');
    } finally {
      setIsLoading(false);  // Set loading to false after the fetch completes
    }
  };

  const toggleBookmark = async (recipe) => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      setShowPopover(true);
      return;
    }

    const isBookmarked = bookmarkedRecipes.some((r) => r.id === recipe.id);
    if (isBookmarked) {
      setWarningMessage('This recipe is already saved');
      return;
    } else {
      setWarningMessage('');
      setBookmarkedRecipes([...bookmarkedRecipes, recipe]);

      const token = sessionStorage.getItem('token');
      const userEmail = sessionStorage.getItem('userEmail');
      try {
        await axios.post('https://foodz-hma3.onrender.com/bookmarks', {
          title: recipe.title,
          image: recipe.image,
          ingredients: recipe.extendedIngredients.map((ing) => ing.name),
          email: userEmail, // Include the userEmail retrieved from sessionStorage
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Error saving bookmark:', error);

      }
    }
  };

  const isRecipeBookmarked = (recipe) => {
    return bookmarkedRecipes.some((r) => r.id === recipe.id);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <>
      <div className='p-14 bg-green-900 min-h-screen'>
        <div className='bg-green-900 min-h-96'>
          <div className="max-w-md mx-auto px-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            <h2 className="text-lime-600 font-medium mb-4">Add Ingredients</h2>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                className="border border-gray-300 rounded-md p-2 flex-1"
                placeholder="Enter an ingredient"
              />
              <button
                onClick={handleAdd}
                className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded"
              >
                Add
              </button>
            </div>
            <ul className="list-disc pl-5">
              {ingredients.map((item, index) => (
                <li key={index} className="flex items-center justify-between mb-2 text-white bg-lime-500 p-1 rounded-xl">
                  <span>{item}</span>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={fetchRecipes}
              className="mt-4 bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded"
            >
              Get Recipes
            </button>
            {isLoading && (
              <div className="mt-4 flex justify-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
              </div>
            )}
            {error && (
              <div className="mt-12 mx-4 px-4 rounded-md border-l-4 border-red-500 bg-red-50 md:max-w-2xl md:mx-auto md:px-8">
                <div className="flex justify-between py-3">
                  <div className="flex">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="self-center ml-3">
                      <span className="text-red-600 font-semibold">
                        Error
                      </span>
                      <p className="text-red-600 mt-1">
                        {error}
                      </p>
                    </div>
                  </div>
                  <button onClick={clearError} className="self-start text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            {warningMessage && (
              <div className="mt-4 mx-4 px-4 rounded-md border-l-4 border-yellow-500 bg-yellow-50 md:max-w-2xl md:mx-auto md:px-8">
                <div className="flex justify-between py-3">
                  <div className="flex">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v8a1 1 0 01-2 0V4a1 1 0 011-1zm0 10a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="self-center ml-3">
                      <span className="text-yellow-600 font-semibold">
                        Warning
                      </span>
                      <p className="text-yellow-600 mt-1">
                        {warningMessage}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setWarningMessage('')} className="self-start text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            <div className="mt-6">
              {recipes.length > 0 && (
                <div>
                  <h2 className="text-lime-600 font-medium mb-4">Recipes</h2>
                  <ul className="space-y-4">
                    {recipes.map((recipe, index) => (
                      <li key={index} className="bg-white p-4 rounded-lg shadow-md relative">
                        <h3 className="text-green-900 font-medium mb-2">{recipe.title}</h3>
                        <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover rounded-md mb-2" />
                        <p className="text-sm text-gray-700">
                          Ingredients: {recipe.extendedIngredients.map(ing => ing.name).join(', ')}
                        </p>
                        {expandedRecipeIndex === index ? (
                          <div className="mt-2">
                            <h4 className="text-green-900 font-medium mb-1">Nutrition:</h4>
                            <ul className="text-sm text-gray-700">
                              {recipe.nutrition.nutrients.map(nutrient => (
                                <li key={nutrient.name}>
                                  {nutrient.name}: {nutrient.amount} {nutrient.unit}
                                </li>
                              ))}
                            </ul>
                            <button
                              onClick={() => setExpandedRecipeIndex(null)}
                              className="mt-2 text-blue-500 hover:underline"
                            >
                              Read Less
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setExpandedRecipeIndex(index)}
                            className="mt-2 text-blue-500 hover:underline"
                          >
                            Read More
                          </button>
                        )}
                        <button
                          onClick={() => toggleBookmark(recipe)}
                          className="absolute top-2 right-2 text-black hover:text-black"
                        >
                          {isRecipeBookmarked(recipe) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                              <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showPopover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-medium text-gray-900">Please log in to add bookmarks</h2>
            <p className="mt-2 text-sm text-gray-600">You need to be logged in to bookmark recipes. Please log in to continue.</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPopover(false)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Ing;
