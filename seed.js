const mongoose = require("mongoose");

const Product = require("./models/Product");

const products = [
  {
    name: "Nothing Phone 1",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS80TB1BPPOmfuK5apPf3XaIQKmPShSGSGJUQ&s",
    price: 31999,
    desc: "8 GB RAM | 256 GB ROM | 16.64 cm (6.55 inch) | Full HD+ Display |50MP + 50MP | 16MP Front Camera | 4500 mAh Lithium-ion Battery | Qualcomm Snapdragon 778G+ Processor",
  },
  {
    name: "Black Gojo Domain Graphic Printed Oversized Sweatshirt",
    img: "https://images.bewakoof.com/t1080/men-s-black-gojo-domain-graphic-printed-oversized-sweatshirt-541482-1703689940-1.jpg",
    price: 999,
    desc: "Oversized fit - Super Loose On Body Thoda Hawa Aane De || Fleece - Soft and sturdy for maximum comfort",
  },
  {
    name: "Black Thread Embroidered Dress",
    img: "https://i.etsystatic.com/11949436/r/il/176d69/2076966076/il_570xN.2076966076_eq2p.jpg",
    price: 31369,
    desc: "Condition Brand New (Made to Order) | Style: Long Flared Dress | Fully Lined from Inside | Fabric: Pure Crepe Silk | Embroidery: Intricate Silk Thread Embroidery | Base Colour: Black | Embroidery Colour: Multi-Colour",
  },
  {
    name: "Nike Dunk Low",
    img: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4371ac31-97cd-4057-bd6e-41440e39f3b9/dunk-low-big-kids-shoes-S3lSGW.png",
    price: 7520,
    desc: "Shown: White/White/Black | Style: CW1590-100",
  },
];

async function seedDB() {
  await Product.insertMany(products);
  console.log("Data seeded successfully");
}

module.exports = seedDB;
