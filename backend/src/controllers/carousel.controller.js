const Carousel = require("../models/Carousel");

const defaults = [
  {
    title: "Premium Shopping Experience",
    subtitle: "Discover top-quality products at unbeatable prices",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Fresh Arrivals Every Week",
    subtitle: "Explore new collections for home, fashion, and electronics",
    image: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Trusted by Thousands",
    subtitle: "Your one-stop department store for everyday essentials",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1400&q=80",
  },
];

const getSlides = async (_req, res) => {
  try {
    const slides = await Carousel.find().sort({ createdAt: -1 });
    if (slides.length > 0) {
      return res.json(slides);
    }
    return res.json(defaults);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch slides", error: error.message });
  }
};

module.exports = { getSlides };
