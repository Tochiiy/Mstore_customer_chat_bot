export const getOnlineImage = (
  brand: string = "", 
  color: string = "", 
  id: number | string = 0
): string => {
  const b = brand.toLowerCase();
  const c = color.toLowerCase();
  
  
  const numericId = typeof id === 'string' ? parseInt(id.replace(/\D/g, '')) || 0 : (id as number);

  
  const colorPools = {
    black: [
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&q=80",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=80",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80"
    ],
    white_cream: [
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=500&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80"
    ],
    red_pink: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", // Red Nike
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80", // Vans
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80" // Green/Pink
    ],
    blue_navy: [
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500&q=80",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&q=80",
      "https://images.unsplash.com/photo-1588600878108-578307a3cc9d?w=500&q=80"
    ],
    grey_brown: [
      "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?w=500&q=80",
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=500&q=80",
      "https://images.unsplash.com/photo-1584735174965-48c48d7028a9?w=500&q=80"
    ],
    default: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&q=80",
      "https://images.unsplash.com/photo-1555274175-75f4056dfd05?w=500&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80"
    ]
  };

  
  let selectedPool = colorPools.default;

  if (c.includes('black') || c.includes('navy')) selectedPool = colorPools.black;
  else if (c.includes('white') || c.includes('cream') || c.includes('beige')) selectedPool = colorPools.white_cream;
  else if (c.includes('red') || c.includes('pink') || c.includes('coral') || c.includes('orange')) selectedPool = colorPools.red_pink;
  else if (c.includes('blue') || c.includes('purple')) selectedPool = colorPools.blue_navy;
  else if (c.includes('grey') || c.includes('brown') || c.includes('green')) selectedPool = colorPools.grey_brown;


  if (b.includes('vans') && c.includes('red')) {
    return "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80";
  }

  const index = numericId % selectedPool.length;
  return selectedPool[index];
};