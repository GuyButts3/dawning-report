import axios from 'axios';
import { getIngredients } from './supabase.js';

const BUNGIE_API_BASE = 'https://www.bungie.net/Platform';

export async function getPlayerIngredients(membershipType, membershipId, accessToken) {
  try {
    // Fetch ingredient list from database
    const dbIngredients = await getIngredients();
    
    // Create hash lookup from database
    const DAWNING_INGREDIENTS = {};
    dbIngredients.forEach(ing => {
      if (ing.bungie_hash) {
        DAWNING_INGREDIENTS[ing.bungie_hash.toString()] = {
          id: ing.id,
          name: ing.name,
          type: ing.type,
          bucket_image_name: ing.bucket_image_name
        };
      }
    });

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
        ...DAWNING_INGREDIENTS[hash],
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
