/* Place your JavaScript in this file */
const mealsEl = document.getElementById("meals"); // div
const favoriteContainer = document.getElementById("fav-meals"); // div
const mealPopup = document.getElementById("meal-popup"); //id dv
const mealInfoEl = document.getElementById("meal-info"); //id div
const popupCloseBtn = document.getElementById("close-popup"); // button
// input
const searchTerm = document.getElementById("search-term"); // input 
const searchBtn = document.getElementById("search"); // btn

getRandomMeal();
fetchFavMeals();
// function getRandomMeal
async function getRandomMeal() {
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php" // fetch data
    );
    const respData = await resp.json();
    // meals api
    const randomMeal = respData.meals[0];
    console.log(respData)
    addMeal(randomMeal, true);
  
}
// getMealById()
async function getMealById(id) {
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id //fetch id
    );

    const respData = await resp.json();
    const meal = respData.meals[0];
    console.log(respData)
    return meal;
}

async function getMealsBySearch(term) {
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term // fetch term
    );

    const respData = await resp.json();
    const meals = respData.meals;
    console.log(respData)
    return meals;
}

function addMeal(mealData, random = false) {
    console.log(mealData);

    const meal = document.createElement("div");
    meal.classList.add("meal");

    meal.innerHTML = `
        <div class="meal-header">
            ${
                random
                    ? `
            <span class="random"> Launch Random Recipe </span>`
                    : ""
            }
            <!-- strMealThumb api-->
            <img 
                src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"
            />
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i  style="font-size : 0.7rem "> + add to fav</i> <br>
                <i class ="likes" class="fas fa-heart"> 0</i> 
                <i  onclick="count()" style="font-size : 0.7rem" id="likes"> likes</i>
            </button>
        </div>
    `;

    const btn = meal.querySelector(".meal-body .fav-btn");

    btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) {
            removeMealLS(mealData.idMeal);
            btn.classList.remove("active");
        } else {
            addMealLS(mealData.idMeal);
            btn.classList.add("active");
        }

        fetchFavMeals();
    });

    meal.addEventListener("click", () => {
        showMealInfo(mealData);
    });

    mealsEl.appendChild(meal);
    count()
}

function addMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem(
        "mealIds",
        JSON.stringify(mealIds.filter((id) => id !== mealId))
    );
}

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
    // clean the container
    favoriteContainer.innerHTML = "";

    const mealIds = getMealsLS();

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);

        addMealFav(meal);
    }
}
//
var favMeal =""
function addMealFav(mealData) {
    const favMeal = document.createElement("li");

    favMeal.innerHTML = `
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        /><span>${mealData.strMeal}</span>
        <button class="clear"><i class="fas fa-window-close"></i></button>
    `;

    const btn = favMeal.querySelector(".clear");

    btn.addEventListener("click", () => {
        removeMealLS(mealData.idMeal);

        fetchFavMeals();
    });

    favMeal.addEventListener("click", () => {
        showMealInfo(mealData);
    });

    favoriteContainer.appendChild(favMeal);
}

function showMealInfo(mealData) {
    // clean it up
    mealInfoEl.innerHTML = "";

    // update the Meal info
    const mealEl = document.createElement("div");

    const ingredients = [];

    // get ingredients and measures
    for (let i = 1; i <= 20; i++) {
        if (mealData["strIngredient" + i]) {
            ingredients.push(
                `${mealData["strIngredient" + i]} - ${
                    mealData["strMeasure" + i]
                }`
            );
        } else {
            break;
        }
    }

    mealEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        />
        <p>
        ${mealData.strInstructions}
        </p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients
                .map(
                    (ing) => `
            <li>${ing}</li>
            `
                )
                .join("")}
        </ul>
    `;

    mealInfoEl.appendChild(mealEl);

    // show the popup
    mealPopup.classList.remove("hidden");
}

searchBtn.addEventListener("click", async () => {
    // clean container
    mealsEl.innerHTML = "";

    const search = searchTerm.value;
    const meals = await getMealsBySearch(search);

    if (meals) {
        meals.forEach((meal) => {
            addMeal(meal);
        });
    }
});

popupCloseBtn.addEventListener("click", () => {
    mealPopup.classList.add("hidden");
    getRandomMeal()
});

let counter3 = 0;
        function count() {
          document.querySelector('.likes').innerHTML = counter3
          counter3++;
          if (counter3 % 10 == 0) {
            alert("You add 10 recipts");
          }
        }
     document.addEventListener('DOMContentLoaded', function () {
        document.querySelector("h5").onclick = count; 
     })

     function refrech () {; 
								
								
        window.location.reload();
                   
   
}


function remove() {
    document.querySelector('.fav-meals').innerHTML = ' '
    alert("Are your sur to delete your favorite meals")
}

