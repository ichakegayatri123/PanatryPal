import { Recipe } from './types';

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: '15-min-caprese-pasta',
    name: '15-Min Caprese Pasta',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    time: '15m',
    difficulty: 'Easy',
    calories: 380,
    isVeggie: true,
    category: 'Quick Meals',
    description: 'A vibrant, fresh 15-minute pasta dish with cherry tomatoes, basil, and mozzarella, perfect for a fast weeknight dinner.',
    ingredients: [
      { name: 'Spaghetti', amount: '200g' },
      { name: 'Tomato', amount: '1 cup cherry tomatoes' },
      { name: 'Spinach', amount: '1 cup' },
      { name: 'Mozzarella', amount: '100g' },
      { name: 'Basil', amount: '1/2 cup fresh' },
      { name: 'Olive Oil', amount: '2 tbsp' }
    ],
    instructions: [
      'Cook spaghetti in a large pot of boiling salted water according to package instructions.',
      'Halve cherry tomatoes and tear fresh mozzarella into bite-sized pieces.',
      'In a bowl, toss the hot drained pasta with cherry tomatoes, fresh spinach, olive oil, and mozzarella so it slightly melts.',
      'Garnish generously with torn fresh basil, salt, and black pepper to taste.'
    ]
  },
  {
    id: 'honey-garlic-stir-fry',
    name: 'Honey Garlic Stir-fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    time: '20m',
    difficulty: 'Intermediate',
    calories: 420,
    isVeggie: false,
    category: 'Quick Meals',
    description: 'A healthy, savory chicken stir-fry tossed with crisp broccoli, red peppers, and a sticky sweet honey-garlic glaze.',
    ingredients: [
      { name: 'Chicken', amount: '300g diced' },
      { name: 'Broccoli', amount: '1 cup florets' },
      { name: 'Bell Pepper', amount: '1 medium' },
      { name: 'Garlic', amount: '3 cloves' },
      { name: 'Honey', amount: '3 tbsp' },
      { name: 'Soy Sauce', amount: '2 tbsp' }
    ],
    instructions: [
      'In a small bowl, whisk honey, minced garlic, soy sauce, and 1 tbsp of water to make the sauce.',
      'Heat oil in a large skillet or wok over medium-high heat. Add diced chicken and cook until golden and done.',
      'Add broccoli florets and sliced bell pepper, stir-frying for 3-4 minutes until crisp-tender.',
      'Pour the sauce mixture over the ingredients. Toss to combine and simmer for 1-2 minutes until sticky and glossy.'
    ]
  },
  {
    id: 'roasted-cauliflower-steaks',
    name: 'Roasted Cauliflower Steaks',
    image: 'https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?auto=format&fit=crop&w=600&q=80',
    time: '35m',
    difficulty: 'Easy',
    calories: 290,
    isVeggie: true,
    category: 'Vegetarian',
    description: 'Sophisticated gourmet cauliflower steaks roasted to golden-brown perfection, served over a bed of creamy hummus and chimichurri.',
    ingredients: [
      { name: 'Cauliflower', amount: '1 large head' },
      { name: 'Hummus', amount: '1/2 cup' },
      { name: 'Olive Oil', amount: '3 tbsp' },
      { name: 'Garlic Powder', amount: '1 tsp' },
      { name: 'Pomegranate Seeds', amount: '2 tbsp' },
      { name: 'Parsley', amount: '1/4 cup' }
    ],
    instructions: [
      'Preheat oven to 400°F (200°C). Slice cauliflower into 1-inch thick flat steaks.',
      'Brush both sides with olive oil and season with garlic powder, salt, and pepper.',
      'Roast on a baking sheet for 25-30 minutes, turning halfway, until tender and caramelized on the edges.',
      'Spread hummus on the plate, lay the cauliflower steak on top, and garnish with pomegranate seeds and chopped parsley.'
    ]
  },
  {
    id: 'creamy-lentil-dahl',
    name: 'Creamy Lentil Dahl',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
    time: '40m',
    difficulty: 'Easy',
    calories: 320,
    isVeggie: true,
    category: 'Vegetarian',
    description: 'A rich, cozy red lentil stew simmered with warm Indian spices, rich coconut milk, ginger, and fresh cilantro.',
    ingredients: [
      { name: 'Red Lentils', amount: '1 cup' },
      { name: 'Coconut Milk', amount: '1 can' },
      { name: 'Tomato', amount: '1 can crushed' },
      { name: 'Onion', amount: '1 medium' },
      { name: 'Ginger', amount: '1 tbsp minced' },
      { name: 'Cumin', amount: '1 tsp' }
    ],
    instructions: [
      'Sauté diced onion and minced ginger in a large pot until soft.',
      'Stir in ground cumin and wash lentils. Add to the pot along with crushed tomatoes.',
      'Pour in coconut milk and 1 cup of water. Bring to a gentle boil, then simmer on low for 25 minutes until lentils are soft.',
      'Stir well, season with salt, and serve hot with fresh coriander leaves.'
    ]
  },
  {
    id: 'zesty-rice-beans',
    name: 'Zesty Rice & Beans',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    time: '20m',
    difficulty: 'Easy',
    calories: 310,
    isVeggie: true,
    category: 'Budget Friendly',
    costCategory: 'Under $5',
    description: 'A highly nutritious, budget-friendly staple featuring fluffy seasoned white rice and black beans with a squeeze of fresh lime.',
    ingredients: [
      { name: 'Rice', amount: '1 cup' },
      { name: 'Black Beans', amount: '1 can drained' },
      { name: 'Avocado', amount: '1' },
      { name: 'Lime', amount: '1' },
      { name: 'Cilantro', amount: '1/4 cup' },
      { name: 'Garlic', amount: '1 clove' }
    ],
    instructions: [
      'Cook white rice according to package directions.',
      'In a saucepan, heat drained black beans with minced garlic, cumin, and a splash of water for 5 minutes.',
      'Spoon fluffy rice into bowls, top with seasoned beans, fresh avocado slices, and chopped cilantro.',
      'Squeeze fresh lime juice over the top right before serving.'
    ]
  },
  {
    id: 'classic-potato-frittata',
    name: 'Classic Potato Frittata',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    time: '30m',
    difficulty: 'Easy',
    calories: 270,
    isVeggie: true,
    category: 'Budget Friendly',
    costCategory: 'Under $3',
    description: 'Golden-brown Spanish-style frittata packed with layers of pan-fried sliced potatoes, sweet onions, and seasoned eggs.',
    ingredients: [
      { name: 'Eggs', amount: '6 large' },
      { name: 'Potato', amount: '2 medium' },
      { name: 'Onion', amount: '1 small' },
      { name: 'Olive Oil', amount: '3 tbsp' },
      { name: 'Salt', amount: '1/2 tsp' }
    ],
    instructions: [
      'Peel and slice potatoes into thin rounds. Slice the onion finely.',
      'Heat olive oil in a non-stick skillet. Cook potatoes and onions on medium-low until potatoes are soft but not brown.',
      'In a bowl, beat eggs with salt. Strain cooked potatoes/onions and mix gently into the beaten eggs; let sit for 5 minutes.',
      'Pour back into the skillet. Cook on low for 6-8 minutes, then flip or broil top until set and beautifully golden.'
    ]
  },
  {
    id: 'creamy-basil-pesto-pasta',
    name: 'Creamy Basil Pesto Pasta',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80',
    time: '20m',
    difficulty: 'Easy',
    calories: 450,
    isVeggie: true,
    category: 'Quick Meals',
    description: 'Luscious spaghetti cooked al dente, tossed in an aromatic fresh basil pesto made with pine nuts, garlic, parmesan, and a touch of heavy cream.',
    ingredients: [
      { name: 'Spaghetti', amount: '400g' },
      { name: 'Basil', amount: '2 cups leaves' },
      { name: 'Pine Nuts', amount: '1/4 cup toasted' },
      { name: 'Parmesan Cheese', amount: '1/2 cup grated' },
      { name: 'Heavy Cream', amount: '100ml' },
      { name: 'Garlic', amount: '2 cloves' },
      { name: 'Olive Oil', amount: '4 tbsp' }
    ],
    instructions: [
      'Bring a large pot of salted water to a boil. Add the pasta and cook according to package instructions until al dente.',
      'While pasta cooks, combine basil, toasted pine nuts, garlic, and parmesan in a food processor. Pulse until finely chopped.',
      'With the processor running, slowly drizzle in the olive oil until a smooth paste forms. Set aside.',
      'In a large skillet over low heat, add the heavy cream and whisk in the prepared pesto. Stir until heated through but not boiling.',
      'Drain the pasta, reserving 1/4 cup of water. Toss pasta in the sauce, adding reserved water if needed for extra creaminess.'
    ]
  },
  {
    id: 'roasted-tomato-pasta',
    name: 'Roasted Tomato Pasta',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    time: '25m',
    difficulty: 'Easy',
    calories: 410,
    isVeggie: true,
    category: 'Suggested',
    description: 'Sweet, blistered cherry tomatoes roasted in garlic olive oil, tossed with freshly cooked spaghetti, parmesan, and aromatic basil.',
    ingredients: [
      { name: 'Spaghetti', amount: '350g' },
      { name: 'Tomato', amount: '2 cups cherry tomatoes' },
      { name: 'Garlic', amount: '4 cloves sliced' },
      { name: 'Basil', amount: '1/2 cup' },
      { name: 'Olive Oil', amount: '4 tbsp' },
      { name: 'Parmesan Cheese', amount: '1/3 cup grated' }
    ],
    instructions: [
      'Preheat oven to 400°F (200°C). Toss cherry tomatoes and sliced garlic with olive oil, salt, and pepper on a baking sheet.',
      'Roast for 15-20 minutes until tomatoes are blistered and juicy.',
      'Meanwhile, boil spaghetti al dente. Drain, reserving some pasta water.',
      'Toss spaghetti with the roasted tomatoes, garlic oil, torn basil, and parmesan. Add cooking water to bind if needed.'
    ]
  },
  {
    id: 'spinach-feta-frittata',
    name: 'Spinach & Feta Frittata',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    time: '20m',
    difficulty: 'Intermediate',
    calories: 280,
    isVeggie: true,
    category: 'Suggested',
    description: 'A fluffy, savory frittata loaded with fresh organic baby spinach leaves, salty crumbled feta cheese, and fragrant sautéed onions.',
    ingredients: [
      { name: 'Eggs', amount: '6 large' },
      { name: 'Spinach', amount: '2 cups packed' },
      { name: 'Feta Cheese', amount: '80g crumbled' },
      { name: 'Heavy Cream', amount: '2 tbsp' },
      { name: 'Onion', amount: '1/2 diced' },
      { name: 'Garlic', amount: '1 clove' }
    ],
    instructions: [
      'Preheat oven broiler. Whisk eggs with heavy cream, salt, and pepper in a bowl.',
      'Sauté diced onion and minced garlic in an oven-safe skillet until fragrant. Add baby spinach and cook until wilted.',
      'Pour whisked eggs into the skillet. Sprinkle crumbled feta cheese evenly over the top.',
      'Cook on low for 5 minutes until edges are set, then place skillet under broiler for 2-3 minutes until golden and puffed.'
    ]
  },
  {
    id: 'lemon-garlic-salmon',
    name: 'Lemon Garlic Salmon',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
    time: '15m',
    difficulty: 'Easy',
    calories: 460,
    isVeggie: false,
    category: 'Suggested',
    description: 'Crispy seared gourmet salmon fillet topped with thin zesty lemon slices, rich melted garlic butter, and fresh dill.',
    ingredients: [
      { name: 'Salmon', amount: '2 fillets' },
      { name: 'Lemon', amount: '1 sliced' },
      { name: 'Garlic', amount: '3 cloves' },
      { name: 'Butter', amount: '2 tbsp' },
      { name: 'Asparagus', amount: '1 bunch' },
      { name: 'Olive Oil', amount: '1 tbsp' }
    ],
    instructions: [
      'Pat salmon fillets dry and season with salt and pepper. Snap woody ends off asparagus.',
      'Heat olive oil and 1 tbsp butter in a skillet over medium-high heat. Sear salmon skin-side up for 4 minutes.',
      'Flip salmon. Add asparagus, sliced lemon, remaining butter, and minced garlic to the pan, spooning melted garlic butter over salmon.',
      'Cook for another 3-4 minutes until salmon is flaky and asparagus is tender-crisp. Garnish with dill.'
    ]
  },
  {
    id: 'classic-butter-chicken',
    name: 'Classic Butter Chicken',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    time: '30m',
    difficulty: 'Intermediate',
    calories: 520,
    isVeggie: false,
    category: 'Suggested',
    description: 'Tender tandoori chicken cooked in a rich, buttery, creamy tomato sauce infused with aromatic spices.',
    ingredients: [
      { name: 'Chicken', amount: '400g cubed' },
      { name: 'Tomato', amount: '1.5 cups tomato puree' },
      { name: 'Butter', amount: '3 tbsp' },
      { name: 'Heavy Cream', amount: '100ml' },
      { name: 'Garlic', amount: '4 cloves minced' },
      { name: 'Ginger', amount: '1 tbsp minced' },
      { name: 'Onion', amount: '1 medium' }
    ],
    instructions: [
      'Sauté diced onions, ginger, and garlic in a large skillet with 1 tbsp of butter until golden.',
      'Add chicken cubes and spices (garam masala, turmeric, chili powder) and cook until browned.',
      'Pour in the tomato puree, simmer for 15 minutes on medium heat.',
      'Stir in the remaining butter and heavy cream. Simmer for 3 more minutes. Garnish with fresh cilantro.'
    ]
  },
  {
    id: 'paneer-tikka-masala',
    name: 'Paneer Tikka Masala',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    time: '25m',
    difficulty: 'Intermediate',
    calories: 440,
    isVeggie: true,
    category: 'Vegetarian',
    description: 'Cubed Indian cottage cheese (Paneer) grilled to perfection and tossed in a rich, spicy, and creamy onion-tomato gravy.',
    ingredients: [
      { name: 'Paneer', amount: '250g cubed' },
      { name: 'Tomato', amount: '1 cup crushed' },
      { name: 'Bell Pepper', amount: '1 medium diced' },
      { name: 'Onion', amount: '1 large diced' },
      { name: 'Garlic', amount: '3 cloves' },
      { name: 'Heavy Cream', amount: '3 tbsp' },
      { name: 'Butter', amount: '1 tbsp' }
    ],
    instructions: [
      'In a hot pan, sear paneer, onion, and bell pepper cubes with a splash of oil until edges are charred. Set aside.',
      'In the same pan, melt butter and sauté garlic and remaining onion until translucent. Add tomato puree and spices.',
      'Simmer the sauce for 10 minutes until oil starts to separate.',
      'Add the grilled paneer and veggies. Stir in the heavy cream and serve hot with flatbread or rice.'
    ]
  },
  {
    id: 'chana-masala-chickpeas',
    name: 'Spiced Chana Masala',
    image: 'https://images.unsplash.com/photo-1585938338392-50a5993082ee?auto=format&fit=crop&w=600&q=80',
    time: '20m',
    difficulty: 'Easy',
    calories: 280,
    isVeggie: true,
    category: 'Budget Friendly',
    costCategory: 'Under $3',
    description: 'A traditional Indian budget meal featuring chickpeas slow-simmered in a zesty ginger-tomato sauce with garam masala.',
    ingredients: [
      { name: 'Chickpeas', amount: '1 can rinsed' },
      { name: 'Tomato', amount: '1 can chopped' },
      { name: 'Onion', amount: '1 large chopped' },
      { name: 'Garlic', amount: '2 cloves minced' },
      { name: 'Ginger', amount: '1 tsp minced' },
      { name: 'Cilantro', amount: '1/4 cup' }
    ],
    instructions: [
      'Heat oil in a medium pan. Sauté onion, garlic, and ginger until sweet and browned.',
      'Add ground cumin, coriander, turmeric, and chili. Stir-fry for 1 minute to bloom spices.',
      'Add tomatoes and drained chickpeas. Pour in 1/2 cup of water and simmer on medium-low for 12 minutes.',
      'Slightly mash some chickpeas to thicken the gravy. Garnish with chopped cilantro and a squeeze of lemon.'
    ]
  },
  /* --- EXTRA REQUESTED TRADITIONAL INDIAN & GLOBAL RECIPES --- */
  {
    id: 'chicken-biryani',
    name: 'Fragrant Chicken Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    time: '45m',
    difficulty: 'Advanced',
    calories: 620,
    isVeggie: false,
    category: 'Suggested',
    description: 'The crown jewel of Indian cuisine: aromatic Basmati rice layered with spiced marinated chicken, saffron, caramelized onions, and fresh mint.',
    ingredients: [
      { name: 'Rice', amount: '2 cups Basmati' },
      { name: 'Chicken', amount: '400g on-bone' },
      { name: 'Onion', amount: '2 large sliced' },
      { name: 'Tomato', amount: '1 chopped' },
      { name: 'Yogurt', amount: '1/2 cup' },
      { name: 'Garlic', amount: '4 cloves' },
      { name: 'Ginger', amount: '1 tbsp' }
    ],
    instructions: [
      'Marinate chicken in yogurt, ginger-garlic paste, lemon juice, garam masala, and chili powder for at least 30 minutes.',
      'Wash and parboil Basmati rice with whole spices (cardamom, cloves, bay leaf) until 70% cooked. Drain and set aside.',
      'In a heavy pot, fry sliced onions until deep golden-brown and crispy (birista). Set half aside for garnish.',
      'Sauté chicken in the remaining onions with chopped tomatoes until cooked through and a thick gravy forms.',
      'Layer the parboiled rice over the chicken, sprinkle saffron milk, fried onions, mint, and fresh cilantro.',
      'Seal the pot tightly with foil/lid and cook on very low heat (Dum) for 15 minutes to allow flavors to fuse.'
    ]
  },
  {
    id: 'dal-makhani',
    name: 'Rich Dal Makhani',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    time: '50m',
    difficulty: 'Intermediate',
    calories: 390,
    isVeggie: true,
    category: 'Vegetarian',
    description: 'A creamy, velvety North Indian slow-cooked black lentil and kidney bean delicacy simmered overnight with tomatoes, butter, and cream.',
    ingredients: [
      { name: 'Red Lentils', amount: '1 cup black lentils (urad)' },
      { name: 'Butter', amount: '4 tbsp' },
      { name: 'Heavy Cream', amount: '4 tbsp' },
      { name: 'Tomato', amount: '1 cup tomato puree' },
      { name: 'Garlic', amount: '4 cloves minced' },
      { name: 'Ginger', amount: '1 tbsp' }
    ],
    instructions: [
      'Soak black lentils and red kidney beans overnight. Boil until completely tender and soft.',
      'Heat 2 tbsp of butter in a pot. Sauté ginger-garlic paste and chili powder for 1 minute.',
      'Add tomato puree and simmer for 10 minutes until cooked.',
      'Stir in the boiled lentils, mashing them slightly with the back of a spoon to release starches.',
      'Add 1 cup of water, simmer on very low heat for 30 minutes to develop the classic creamy texture.',
      'Stir in the remaining butter and heavy cream. Simmer for 5 minutes. Serve hot with Naan.'
    ]
  },
  {
    id: 'aloo-gobi-adraki',
    name: 'Aloo Gobi Adraki',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80',
    time: '20m',
    difficulty: 'Easy',
    calories: 210,
    isVeggie: true,
    category: 'Budget Friendly',
    costCategory: 'Under $2.50',
    description: 'A classic, comforting home-style dry curry of tender potatoes and cauliflower florets seasoned with ginger, turmeric, and green chilies.',
    ingredients: [
      { name: 'Potato', amount: '2 medium cubed' },
      { name: 'Cauliflower', amount: '1/2 head florets' },
      { name: 'Ginger', amount: '2 tbsp julienned' },
      { name: 'Tomato', amount: '1 diced' },
      { name: 'Cilantro', amount: '1/4 cup' },
      { name: 'Cumin', amount: '1 tsp seeds' }
    ],
    instructions: [
      'Heat oil in a skillet. Add cumin seeds and let them sizzle.',
      'Add julienned ginger, diced potatoes, and cauliflower florets. Stir well to coat with oil.',
      'Add turmeric, coriander powder, cumin powder, and salt. Cover and cook on low heat for 12-15 minutes, stirring occasionally, until potatoes are tender.',
      'Add diced tomatoes and cook uncovered for 3-4 minutes until softened.',
      'Garnish generously with fresh ginger juliennes and fresh cilantro leaves.'
    ]
  },
  {
    id: 'spanish-seafood-paella',
    name: 'Authentic Seafood Paella',
    image: 'https://images.unsplash.com/photo-1534080391025-497c03762aa0?auto=format&fit=crop&w=600&q=80',
    time: '35m',
    difficulty: 'Advanced',
    calories: 490,
    isVeggie: false,
    category: 'Suggested',
    description: 'Vibrant saffron-infused Spanish rice cooked in an open pan with garlic, tomatoes, bell peppers, peas, and succulent pan-seared shrimp.',
    ingredients: [
      { name: 'Rice', amount: '1.5 cups Arborio' },
      { name: 'Bell Pepper', amount: '1 sliced' },
      { name: 'Tomato', amount: '1 crushed' },
      { name: 'Garlic', amount: '3 cloves' },
      { name: 'Peas', amount: '1/2 cup' },
      { name: 'Lemon', amount: '1 sliced' }
    ],
    instructions: [
      'Heat olive oil in a wide paella pan. Sauté diced bell peppers, onions, and minced garlic until soft.',
      'Stir in crushed tomatoes and sweet paprika. Add Arborio rice, stirring to toast the grains slightly for 2 minutes.',
      'Pour in hot saffron-infused broth, season with salt, and bring to a simmer. Cook uncovered on medium-low for 15 minutes (Do not stir!).',
      'Press shrimp, seafood, and peas gently into the rice layer. Cook for 8 more minutes until rice is tender and liquid is absorbed.',
      'Turn heat up for 1 minute to create the prized crispy caramelized rice crust on the bottom (Socarrat).',
      'Remove from heat, cover with a clean kitchen towel for 5 minutes, and serve decorated with fresh lemon wedges.'
    ]
  },
  {
    id: 'california-sushi-rolls',
    name: 'California Sushi Rolls',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
    time: '25m',
    difficulty: 'Intermediate',
    calories: 320,
    isVeggie: true,
    category: 'Quick Meals',
    description: 'An elegant Japanese-American sushi rolls featuring vinegared sushi rice, creamy avocado, crisp cucumber, and seaweed, served with soy sauce.',
    ingredients: [
      { name: 'Rice', amount: '1 cup sushi rice' },
      { name: 'Avocado', amount: '1 sliced' },
      { name: 'Cucumber', amount: '1 julienned' },
      { name: 'Soy Sauce', amount: '3 tbsp' },
      { name: 'Nori Sheets', amount: '2 sheets' }
    ],
    instructions: [
      'Cook sushi rice and season with rice vinegar, sugar, and salt. Allow to cool to room temperature.',
      'Place a sheet of nori seaweed on a bamboo rolling mat. Spread cooled rice evenly over nori, leaving a 1/2 inch border.',
      'Flip the sheet over so the rice is facing down (for inside-out rolls) or keep rice-side up.',
      'Arrange sliced avocado and julienned cucumber horizontally across the center of the sheet.',
      'Roll tightly using the bamboo mat. Slice into 8 bite-sized rounds with a wet, sharp knife. Serve with soy sauce and pickled ginger.'
    ]
  },
  {
    id: 'mexican-ground-beef-tacos',
    name: 'Classic Ground Beef Tacos',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    time: '15m',
    difficulty: 'Easy',
    calories: 450,
    isVeggie: false,
    category: 'Quick Meals',
    description: 'Crunchy corn shells stuffed with perfectly seasoned lean ground beef, crisp shredded lettuce, and sharp cheddar cheese.',
    ingredients: [
      { name: 'Beef', amount: '300g ground' },
      { name: 'Cheese', amount: '1/2 cup cheddar' },
      { name: 'Tomato', amount: '1 diced' },
      { name: 'Taco Shells', amount: '6 shells' },
      { name: 'Onion', amount: '1/2 finely chopped' },
      { name: 'Cilantro', amount: '2 tbsp' }
    ],
    instructions: [
      'In a skillet, cook ground beef and chopped onion over medium-high heat until beef is browned. Drain fat.',
      'Stir in taco seasoning (chili, cumin, garlic powder) and 1/4 cup of water. Simmer 5 minutes until thick.',
      'Warm taco shells in the oven for 3 minutes at 350°F.',
      'Spoon seasoned beef into shells. Layer with cheese, fresh tomatoes, lettuce, and cilantro.'
    ]
  },
  {
    id: 'loaded-veggie-quesadilla',
    name: 'Loaded Veggie Quesadilla',
    image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=600&q=80',
    time: '15m',
    difficulty: 'Easy',
    calories: 360,
    isVeggie: true,
    category: 'Budget Friendly',
    costCategory: 'Under $3',
    description: 'Crisp tortilla folded over a melted blend of mozzarella and cheddar cheese, sweet corn, black beans, and peppers.',
    ingredients: [
      { name: 'Tortillas', amount: '2 large' },
      { name: 'Cheese', amount: '1 cup shredded' },
      { name: 'Black Beans', amount: '1/2 cup' },
      { name: 'Bell Pepper', amount: '1/2 cup chopped' },
      { name: 'Onion', amount: '1/4 chopped' },
      { name: 'Butter', amount: '1 tbsp' }
    ],
    instructions: [
      'Sauté chopped bell pepper and onion in a small pan until tender.',
      'Lay a tortilla flat. Sprinkle half the cheese, black beans, sautéed peppers, and the remaining cheese over one half of the tortilla.',
      'Fold the tortilla in half. Melt butter in a clean skillet over medium heat.',
      'Grill the quesadilla for 3-4 minutes per side until the tortilla is golden-brown and crispy, and the cheese is melted.'
    ]
  },
  {
    id: 'margherita-pizza',
    name: 'Neapolitan Margherita Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    time: '20m',
    difficulty: 'Intermediate',
    calories: 490,
    isVeggie: true,
    category: 'Quick Meals',
    description: 'The ultimate Italian masterpiece with a crispy crust, aromatic pizza sauce, fresh melting mozzarella, and sweet basil leaves.',
    ingredients: [
      { name: 'Pizza Crust', amount: '1 pre-baked' },
      { name: 'Tomato', amount: '1/2 cup marinara' },
      { name: 'Mozzarella', amount: '120g fresh sliced' },
      { name: 'Basil', amount: '1/4 cup fresh' },
      { name: 'Olive Oil', amount: '1 tbsp' }
    ],
    instructions: [
      'Preheat your oven to 450°F (230°C). Lay the pre-baked pizza crust on a baking stone or tray.',
      'Spread marinara sauce evenly across the dough, leaving a small border around the edge.',
      'Arrange sliced fresh mozzarella cheese over the sauce.',
      'Bake for 8-10 minutes until the cheese is bubbling and crust is golden. Top with fresh basil and a drizzle of olive oil.'
    ]
  },
  {
    id: 'creamy-chicken-alfredo',
    name: 'Creamy Chicken Alfredo',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80',
    time: '25m',
    difficulty: 'Intermediate',
    calories: 590,
    isVeggie: false,
    category: 'Suggested',
    description: 'Rich, comforting fettuccine tossed in a silky parmesan cream sauce and topped with grilled sliced chicken breast.',
    ingredients: [
      { name: 'Spaghetti', amount: '250g' },
      { name: 'Chicken', amount: '250g sliced' },
      { name: 'Heavy Cream', amount: '150ml' },
      { name: 'Parmesan Cheese', amount: '1/2 cup' },
      { name: 'Garlic', amount: '3 cloves' },
      { name: 'Butter', amount: '2 tbsp' }
    ],
    instructions: [
      'Boil pasta in salted water according to instructions. Drain and set aside.',
      'In a skillet, melt 1 tbsp of butter and cook chicken slices until fully done. Set chicken aside.',
      'Melt remaining butter in the same skillet. Add minced garlic and cook for 1 minute.',
      'Pour in heavy cream, simmer for 3 minutes, then stir in grated parmesan until thick. Toss with pasta and top with chicken.'
    ]
  },
  {
    id: 'asian-vegetable-noodles',
    name: 'Stir-Fry Sesame Noodles',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    time: '15m',
    difficulty: 'Easy',
    calories: 340,
    isVeggie: true,
    category: 'Quick Meals',
    description: 'Flash-cooked noodles tossed in a premium savory sesame ginger glaze with fresh garden vegetables.',
    ingredients: [
      { name: 'Spaghetti', amount: '200g' },
      { name: 'Broccoli', amount: '1/2 cup' },
      { name: 'Bell Pepper', amount: '1/2 cup' },
      { name: 'Soy Sauce', amount: '3 tbsp' },
      { name: 'Garlic', amount: '2 cloves' },
      { name: 'Ginger', amount: '1 tsp' },
      { name: 'Honey', amount: '1 tbsp' }
    ],
    instructions: [
      'Cook noodles or spaghetti, then drain and rinse with cold water.',
      'Sauté minced garlic, grated ginger, broccoli, and sliced pepper in a skillet with oil for 3 minutes.',
      'Whisk soy sauce, honey, and a splash of water in a cup.',
      'Add noodles and sauce to the skillet, stir-frying on high heat for 2 minutes to glaze.'
    ]
  },
  {
    id: 'crispy-tofu-teriyaki',
    name: 'Crispy Tofu Teriyaki Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    time: '25m',
    difficulty: 'Intermediate',
    calories: 390,
    isVeggie: true,
    category: 'Vegetarian',
    description: 'Golden, pan-fried organic tofu glazed in house-made teriyaki sauce, served over white rice with steamed broccoli.',
    ingredients: [
      { name: 'Tofu', amount: '300g firmed' },
      { name: 'Rice', amount: '1 cup' },
      { name: 'Broccoli', amount: '1 cup' },
      { name: 'Soy Sauce', amount: '3 tbsp' },
      { name: 'Honey', amount: '2 tbsp' },
      { name: 'Garlic', amount: '1 clove' }
    ],
    instructions: [
      'Cook rice according to directions. Press tofu to remove excess moisture and cube it.',
      'Coat tofu cubes in cornstarch (optional) and pan-fry in a hot skillet with oil until crispy on all sides.',
      'Mix soy sauce, honey, and minced garlic. Pour into the skillet with tofu; cook for 1 minute until glazed.',
      'Serve tofu and steamed broccoli florets over a warm bed of fluffy rice.'
    ]
  },
  {
    id: 'classic-smash-burger',
    name: 'Classic Smash Cheeseburger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    time: '15m',
    difficulty: 'Easy',
    calories: 550,
    isVeggie: false,
    category: 'Quick Meals',
    description: 'Juicy, caramelized beef patty pressed thin with melted cheddar cheese, sweet onions, and burger sauce.',
    ingredients: [
      { name: 'Beef', amount: '150g patty' },
      { name: 'Burger Buns', amount: '1' },
      { name: 'Cheese', amount: '1 slice cheddar' },
      { name: 'Onion', amount: '1/2 sliced' },
      { name: 'Garlic', amount: '1 clove' }
    ],
    instructions: [
      'Sauté sliced onions in a skillet until sweet and caramelized. Remove and set aside.',
      'Form beef into a round ball. Place on an extremely hot dry skillet and press/smash completely flat with a spatula.',
      'Sear for 2 minutes until a deep crust forms. Flip and immediately lay cheddar slice on top.',
      'Toast buns, spread with sauce, lay caramelized onions, and top with the melted patty.'
    ]
  },
  {
    id: 'creamy-mac-cheese',
    name: 'Gourmet Creamy Mac & Cheese',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
    time: '20m',
    difficulty: 'Easy',
    calories: 460,
    isVeggie: true,
    category: 'Budget Friendly',
    costCategory: 'Under $3',
    description: 'Decadent elbow macaroni bathed in a rich, velvety cheese sauce made with sharp cheddar and baked to a bubbly finish.',
    ingredients: [
      { name: 'Spaghetti', amount: '250g macaroni' },
      { name: 'Cheese', amount: '1.5 cups cheddar' },
      { name: 'Milk', amount: '1 cup' },
      { name: 'Butter', amount: '2 tbsp' },
      { name: 'Flour', amount: '2 tbsp' }
    ],
    instructions: [
      'Boil macaroni until al dente. Drain and set aside.',
      'In a saucepan, melt butter. Whisk in flour to form a paste; cook for 1 minute.',
      'Slowly pour in milk while whisking constantly. Simmer until the sauce thickens.',
      'Turn off heat. Whisk in shredded cheddar cheese until fully melted. Stir in macaroni.'
    ]
  },
  {
    id: 'double-chocolate-cookies',
    name: 'Double Chocolate Chip Cookies',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
    time: '20m',
    difficulty: 'Easy',
    calories: 240,
    isVeggie: true,
    category: 'Budget Friendly',
    costCategory: 'Under $3',
    description: 'Fresh bakery-style cookies with a soft dough center, crispy edges, and melting dark chocolate chips.',
    ingredients: [
      { name: 'Flour', amount: '1.5 cups' },
      { name: 'Sugar', amount: '1/2 cup' },
      { name: 'Butter', amount: '1/2 cup melted' },
      { name: 'Chocolate Chips', amount: '3/4 cup' },
      { name: 'Eggs', amount: '1 large' }
    ],
    instructions: [
      'Preheat oven to 350°F (175°C). Whisk melted butter and sugar in a large bowl.',
      'Beat in the egg until smooth. Stir in flour and fold in chocolate chips.',
      'Spoon rounded balls of dough onto a parchment-lined baking sheet.',
      'Bake for 10-12 minutes until edges are set. Let cool for 5 minutes before eating.'
    ]
  },
  {
    id: 'fudgy-chocolate-brownies',
    name: 'Fudgy Bakery-Style Brownies',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    time: '25m',
    difficulty: 'Easy',
    calories: 310,
    isVeggie: true,
    category: 'Budget Friendly',
    costCategory: 'Under $3',
    description: 'Dense, rich, ultra-fudgy brownies with crinkly paper-thin tops, loaded with chocolate pockets.',
    ingredients: [
      { name: 'Butter', amount: '1/2 cup' },
      { name: 'Sugar', amount: '1 cup' },
      { name: 'Eggs', amount: '2 large' },
      { name: 'Flour', amount: '1/2 cup' },
      { name: 'Chocolate Chips', amount: '1 cup' }
    ],
    instructions: [
      'Preheat oven to 325°F (160°C). Melt butter and chocolate chips together in a pot.',
      'Remove from heat and whisk in sugar, then add eggs one by one.',
      'Gently fold in flour until just combined.',
      'Pour into an 8x8 greased baking dish and bake for 20-22 minutes. Let cool before slicing.'
    ]
  },
  {
    id: 'avocado-egg-toast',
    name: 'Avocado Toast with Poached Egg',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80',
    time: '10m',
    difficulty: 'Easy',
    calories: 290,
    isVeggie: true,
    category: 'Quick Meals',
    description: 'Toasted artisanal bread topped with creamy seasoned avocado, a perfectly poached warm egg, and chili flakes.',
    ingredients: [
      { name: 'Bread', amount: '2 slices' },
      { name: 'Avocado', amount: '1 mature' },
      { name: 'Eggs', amount: '2' },
      { name: 'Lemon', amount: '1/2 squeezed' },
      { name: 'Garlic', amount: '1 clove' }
    ],
    instructions: [
      'Toast your favorite bread slices. Rub toast surface with a halved garlic clove.',
      'In a bowl, mash avocado flesh with lemon juice, salt, and pepper.',
      'Poach or fry eggs in a small skillet until whites are firm but yolks remain soft.',
      'Spread mashed avocado over toast, layer with eggs, and dust with red pepper flakes.'
    ]
  },
  {
    id: 'mediterranean-chickpea-salad',
    name: 'Mediterranean Chickpea Salad',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    time: '10m',
    difficulty: 'Easy',
    calories: 220,
    isVeggie: true,
    category: 'Vegetarian',
    description: 'A refreshing, colorful salad of crispy cucumbers, sweet tomatoes, seasoned chickpeas, and Greek feta cheese.',
    ingredients: [
      { name: 'Chickpeas', amount: '1 can' },
      { name: 'Tomato', amount: '1 cup cherry' },
      { name: 'Cucumber', amount: '1 diced' },
      { name: 'Feta Cheese', amount: '50g crumbled' },
      { name: 'Olive Oil', amount: '2 tbsp' },
      { name: 'Lemon', amount: '1/2 squeezed' }
    ],
    instructions: [
      'Rinse and drain canned chickpeas thoroughly.',
      'Chop cucumbers and cherry tomatoes into bite-sized pieces.',
      'In a large mixing bowl, combine chickpeas, cucumbers, tomatoes, and crumbled feta.',
      'Drizzle with olive oil and fresh lemon juice. Season with salt, pepper, and dried oregano.'
    ]
  },
  {
    id: 'thai-green-curry',
    name: 'Thai Green Vegetable Curry',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=600&q=80',
    time: '25m',
    difficulty: 'Intermediate',
    calories: 340,
    isVeggie: true,
    category: 'Vegetarian',
    description: 'An authentic aromatic Thai coconut milk curry loaded with fresh eggplant, peppers, and green beans.',
    ingredients: [
      { name: 'Coconut Milk', amount: '1 can' },
      { name: 'Onion', amount: '1/2 chopped' },
      { name: 'Bell Pepper', amount: '1 chopped' },
      { name: 'Ginger', amount: '1 tbsp' },
      { name: 'Soy Sauce', amount: '1 tbsp' },
      { name: 'Garlic', amount: '2 cloves' }
    ],
    instructions: [
      'Sauté diced onions, minced garlic, and minced ginger in a pot with oil for 3 minutes.',
      'Stir in green curry paste (optional) or curry spices and cook for 1 minute.',
      'Pour in coconut milk and soy sauce, bringing to a gentle simmer.',
      'Add chopped peppers, broccoli, or eggplant and simmer for 10 minutes until tender. Serve over rice.'
    ]
  },
  {
    id: 'french-onion-soup',
    name: 'French Onion Soup',
    image: 'https://images.unsplash.com/photo-1547592165-e1d17f1a0655?auto=format&fit=crop&w=600&q=80',
    time: '40m',
    difficulty: 'Intermediate',
    calories: 310,
    isVeggie: true,
    category: 'Budget Friendly',
    costCategory: 'Under $3',
    description: 'Deeply caramelized sweet onions slow-cooked in beef or vegetable broth, topped with crunchy toasted bread and melted cheese.',
    ingredients: [
      { name: 'Onion', amount: '3 large sweet' },
      { name: 'Bread', amount: '2 thick slices' },
      { name: 'Cheese', amount: '1/2 cup shredded' },
      { name: 'Butter', amount: '2 tbsp' },
      { name: 'Garlic', amount: '1 clove' }
    ],
    instructions: [
      'Melt butter in a heavy pot. Add thinly sliced onions and cook on medium-low for 30 minutes, stirring occasionally, until sweet and deep brown.',
      'Add minced garlic and stir-fry 1 minute.',
      'Pour in 4 cups of vegetable broth and simmer for 15 minutes. Season with salt and thyme.',
      'Pour soup into bowls, float toasted bread on top, cover with cheese, and broil until golden-brown.'
    ]
  },
  {
    id: 'garlic-herb-roasted-chicken',
    name: 'Garlic Herb Roasted Chicken',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
    time: '35m',
    difficulty: 'Intermediate',
    calories: 480,
    isVeggie: false,
    category: 'Suggested',
    description: 'Juicy chicken breast marinated in olive oil, garlic, lemon, and fresh herbs, roasted alongside tender baby potatoes.',
    ingredients: [
      { name: 'Chicken', amount: '300g breasts' },
      { name: 'Potato', amount: '2 medium cubed' },
      { name: 'Garlic', amount: '4 cloves' },
      { name: 'Olive Oil', amount: '2 tbsp' },
      { name: 'Lemon', amount: '1/2 squeezed' }
    ],
    instructions: [
      'Preheat oven to 400°F (200°C). Toss cubed potatoes with 1 tbsp olive oil, salt, and pepper.',
      'Pat chicken dry, coat with remaining olive oil, lemon juice, minced garlic, and dried rosemary.',
      'Place chicken and potatoes on a baking sheet in a single layer.',
      'Roast for 25-30 minutes until chicken is golden and registers 165°F, and potatoes are crisp.'
    ]
  },
  {
    id: 'sweet-potato-black-bean-bowl',
    name: 'Sweet Potato & Bean Bowl',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    time: '30m',
    difficulty: 'Easy',
    calories: 330,
    isVeggie: true,
    category: 'Vegetarian',
    description: 'A cozy, high-fiber harvest bowl featuring roasted caramelized sweet potato wedges, seasoned black beans, and lime avocado cream.',
    ingredients: [
      { name: 'Sweet Potato', amount: '1 large cubed' },
      { name: 'Black Beans', amount: '1/2 can' },
      { name: 'Avocado', amount: '1/2 sliced' },
      { name: 'Lime', amount: '1/2' },
      { name: 'Olive Oil', amount: '1 tbsp' },
      { name: 'Spinach', amount: '1 cup' }
    ],
    instructions: [
      'Preheat oven to 400°F. Toss sweet potato cubes with olive oil and salt; roast for 20 minutes until tender.',
      'Warm the black beans in a saucepan with a pinch of cumin and garlic powder.',
      'Assemble the bowl by laying down fresh baby spinach.',
      'Top with roasted sweet potatoes, warm black beans, avocado slices, and a splash of fresh lime juice.'
    ]
  },
  {
    id: 'fluffy-buttermilk-pancakes',
    name: 'Fluffy Old-Fashioned Pancakes',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=600&q=80',
    time: '15m',
    difficulty: 'Easy',
    calories: 320,
    isVeggie: true,
    category: 'Quick Meals',
    description: 'Golden-brown, fluffy pancakes served with fresh berries, powdered sugar, and rich melting maple butter.',
    ingredients: [
      { name: 'Flour', amount: '1 cup' },
      { name: 'Milk', amount: '3/4 cup' },
      { name: 'Butter', amount: '2 tbsp melted' },
      { name: 'Eggs', amount: '1 large' },
      { name: 'Sugar', amount: '2 tbsp' }
    ],
    instructions: [
      'In a bowl, mix flour, sugar, and baking powder.',
      'Whisk in milk, egg, and melted butter until just combined (some lumps are fine).',
      'Heat a non-stick skillet over medium-low heat. Ladle batter to form circular pancakes.',
      'Cook until bubbles pop on the surface, then flip and cook until golden-brown on both sides.'
    ]
  }
];

export function calculateMatchPercentage(recipe: Recipe, activePantryNames: string[]): number {
  if (activePantryNames.length === 0) return 0;
  
  const recipeIngredients = recipe.ingredients.map(i => i.name.toLowerCase());
  let matchedCount = 0;

  recipeIngredients.forEach(ing => {
    // If any active pantry item matches (substring or full word)
    const isMatched = activePantryNames.some(p => 
      ing.includes(p.toLowerCase()) || p.toLowerCase().includes(ing)
    );
    if (isMatched) {
      matchedCount++;
    }
  });

  return Math.round((matchedCount / recipe.ingredients.length) * 100);
}
