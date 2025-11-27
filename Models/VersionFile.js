
import mongoose, { Schema, model, models } from "mongoose";

const VersionFileSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    versionId: {
      type: Schema.Types.ObjectId,
      ref: "Version",
      required: true,
    },

    mainFile: {
      type: String,
      default: null, 
    },


    codeSnippet: {
      type: String,
      default: "",
    },


    expectedOutput: {
      type: String,
      default: "",
    },


    testCase: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const VersionFile =
  models?.VersionFile || model("VersionFile", VersionFileSchema);  