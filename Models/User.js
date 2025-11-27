import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

  
    enrolledProjects: [
      {
        projectId: {
          type: Schema.Types.ObjectId,
          ref: "Project",
        },
        projectName: {
          type: String,
          trim: true,
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = models?.User || model("User", UserSchema);
