// src/utils/dataTransformer.js

export const transformStoreToSocial = (products) => {
  return products.map(item => ({
    name: item.title.substring(0, 10), // Short name for X-axis
    engagement: Math.floor(item.price * 10), // Scale price to "Likes"
    reach: item.rating.count, // Number of views
    sentiment: item.rating.rate // Score out of 5
  }));
};