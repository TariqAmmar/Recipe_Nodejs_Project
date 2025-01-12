require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');


/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const jordan = await Recipe.find({ 'category': 'jordan' }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

    const food = { latest, jordan, american, chinese };

    res.render('index', { title: 'Cooking Blog - Home', categories, food } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categories', categories } );
  } 
  catch (error) 
  {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 
 
/**
 * GET /recipe/:id
 * Recipe 
*/
exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'Cooking Blog - Recipe', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * POST /search
 * Search 
*/
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Cooking Blog - Search', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
  
}

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 



/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Cooking Blog - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}



/*

/**
 * POST /login
 * Handle Login
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      req.flash('infoErrors', 'Invalid username or password.');
      return res.redirect('/login');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      req.flash('infoErrors', 'Invalid username or password.');
      return res.redirect('/login');
    }

    // Set session or JWT (for logged-in state)
    req.session.user = user;
    req.flash('infoSubmit', 'Logged in successfully!');
    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('infoErrors', 'An error occurred during login.');
    res.redirect('/login');
  }
};




// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'Falafel with Hummus' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'Falafel }, { name: 'Falafel with Hummus' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();


/**
 * Dummy Data Example 
*/

/*
// Insert dummy categories
async function insertDymmyCategoryData(){
  try {
    await Category.insertMany([
      { "name": "jordan", "image": "jordan-food.jpg" },
      { "name": "American", "image": "american-food.jpg" },
      { "name": "Chinese", "image": "chinese-food.jpg" },
      { "name": "Mexican", "image": "mexican-food.jpg" },
      { "name": "Indian", "image": "indian-food.jpg" },
      { "name": "Spanish", "image": "spanish-food.jpg" }
    ]);
    console.log('Categories added successfully');
  } catch (error) {
    console.log('Error adding categories:', error);
  }
}
insertDymmyCategoryData();
*/




/*
// Insert dummy recipes
async function insertDymmyRecipeData(){
  try {
    await Recipe.insertMany([
      { 
        "name": "Shawarma",
        "description": "A popular Middle Eastern street food, perfect for wraps and sandwiches.",
        "email": "shawarma@recipes.com",
        "ingredients": [
          "500g chicken",
          "1 cup yogurt",
          "2 tbsp shawarma spices",
          "Pita bread"
        ],
        "category": "jordan",
        "image": "shawarma.jpg"
      },
      { 
        "name": "Falafel",
        "description": "Crispy fried chickpea balls, a staple in Arabic cuisine.",
        "email": "falafel@recipes.com",
        "ingredients": [
          "200g chickpeas",
          "1 cup parsley",
          "1 tbsp garlic",
          "Spices to taste"
        ],
        "category": "jordan",
        "image": "falafel.jpg"
      },
      { 
        "name": "Southern Fried Chicken",
        "description": "Crispy and juicy fried chicken with a flavorful crust.",
        "email": "chicken@recipes.com",
        "ingredients": [
          "1 level teaspoon baking powder",
          "1 level teaspoon cayenne pepper",
          "1 level teaspoon hot smoked paprika"
        ],
        "category": "American",
        "image": "southern-fried-chicken.jpg"
      },
      { 
        "name": "General Tso's Chicken",
        "description": "A Chinese-American dish featuring crispy chicken in a tangy sauce.",
        "email": "general@recipes.com",
        "ingredients": [
          "300g chicken breast",
          "2 tbsp soy sauce",
          "1 tbsp cornstarch",
          "1 cup broccoli"
        ],
        "category": "Chinese",
        "image": "general-tso-chicken.jpg"
      },

      {
        "name": "Apple Pie",
        "description": "Classic homemade apple pie with a flaky crust and sweet, spiced apple filling.",
        "email": "pie@recipes.com",
        "ingredients": [
          "6 medium-sized apples, peeled, cored, and sliced",
          "1/2 cup granulated sugar",
          "1/4 cup brown sugar",
          "1 teaspoon ground cinnamon",
          "1/4 teaspoon ground nutmeg",
          "1/4 teaspoon ground allspice",
          "2 tablespoons all-purpose flour",
          "2 tablespoons butter, cubed",
          "1 double pie crust"
        ],
        "category": "American",
        "image": "apple_pie.jpeg"
      }
    ]);
    console.log('Recipes added successfully');
  } catch (error) 
  {
    console.log('Error adding recipes:', error);
  }

  
}


// Uncomment this line to populate the database
 //insertMoreDummyRecipeData();


// Call these functions only once to populate the database
// Uncomment the lines below to run the functions

 insertDymmyRecipeData();


 */

