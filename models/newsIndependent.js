const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const User     = require("./user");

const newsIndepentArticleSchema = new Schema({
  imgName: String,
  imgPath: {
    type: String,
    default: "../images/newsGenericLogo.png"
  },
  newsTitle: String,
  newsDescription: String,
  newsContent: String,
  location: String
 }, {
    timestamps: { 
      createdAt: "created_at", updatedAt: "updated_at" 
    }
  })

  const newsIndepentArticle = mongoose.model("newsIndependentArticle", newsIndepentArticleSchema);
  module.exports = newsIndepentArticle;