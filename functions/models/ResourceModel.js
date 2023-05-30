/**The resources should be attached to a particular lesson.
 * We should also be having a place to access the global resources.
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ResourceSchema = new Schema(
  {
    resourceName: { type: String, required: true },
    resourceUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Creating a model.
const ResourceModel = mongoose.model("Resource", ResourceSchema);

// Exporting the Model
module.exports = ResourceModel;
