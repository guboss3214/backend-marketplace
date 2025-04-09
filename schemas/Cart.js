const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true, // This field must be set
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add a method to handle adding products
cartSchema.methods.addProduct = function (productId) {
  const existingProduct = this.products.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    this.products.push({
      product: productId,
      quantity: 1,
    });
  }
  return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
