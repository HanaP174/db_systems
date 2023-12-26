module.exports = mongoose => {
  return mongoose.model(
    "library",
    mongoose.Schema(
      {
        title: String,
        description: String,
        published: Boolean
      },
      {timestamps: true}
    )
  );
};
