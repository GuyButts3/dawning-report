import axios from 'axios';

const BUNGIE_API_BASE = 'https://www.bungie.net/Platform';

// Dawning ingredient item hashes (Season 24/2024 Dawning)
const DAWNING_INGREDIENTS = {
  // Common ingredients
  2014411539: 'Delicious Explosion',
  3014509940: 'Sharp Flavor',
  2536554546: 'Impossible Heat',
  3853748946: 'Flash of Inspiration',
  3024629236: 'Personal Touch',
  1102971867: 'Perfect Taste',
  3829138952: 'Balanced Flavors',
  2903510609: 'Bullet Spray',
  // Uncommon ingredients  
  3683254819: 'Null Taste',
  690668916: 'Taken Butter',
  4144521227: 'Ether Cane',
  417164956: 'Dark Ether Cane',
  2946650506: 'Chitin Powder',
  1200918884: 'Cabal Oil',
  3825948919: 'Vex Milk',
  3014509941: 'Superb Texture',
  // Special
  3853748947: 'Dawning Essence',
};

export async function getPlayerIngredients(membershipType, membershipId, accessToken) {
  try {
    const response = await axios.get(
      `${BUNGIE_API_BASE}/Destiny2/${membershipType}/Profile/${membershipId}/?components=ProfileInventories,CharacterInventories,Characters`,
      {
        headers: {
          'X-API-Key': process.env.BUNGIE_API_KEY,
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const profileData = response.data.Response;
    const ingredients = {};

    // Initialize all ingredients to 0
    Object.keys(DAWNING_INGREDIENTS).forEach(hash => {
      ingredients[hash] = {
        name: DAWNING_INGREDIENTS[hash],
        count: 0
      };
    });

    // Check profile inventory
    if (profileData.profileInventory?.data?.items) {
      profileData.profileInventory.data.items.forEach(item => {
        const hashString = item.itemHash.toString();
        if (DAWNING_INGREDIENTS[hashString]) {
          ingredients[hashString].count += item.quantity || 1;
        }
      });
    }

    // Check each character's inventory
    if (profileData.characterInventories?.data) {
      Object.values(profileData.characterInventories.data).forEach(charInventory => {
        charInventory.items.forEach(item => {
          const hashString = item.itemHash.toString();
          if (DAWNING_INGREDIENTS[hashString]) {
            ingredients[hashString].count += item.quantity || 1;
          }
        });
      });
    }

    return ingredients;
  } catch (error) {
    console.error('Error fetching Bungie data:', error.response?.data || error.message);
    throw error;
  }
}

export function getDestinyMembership(destinyMemberships) {
  // Prioritize active platform, fallback to first available
  const activeMembership = destinyMemberships.find(m => m.crossSaveOverride === m.membershipType);
  return activeMembership || destinyMemberships[0];
}
