import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a
// User Document has. You can include any properties that
// you would like to access like createdAt, updatedAt
// etc that Mongoose adds automatically
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  // Override the returned JSON representation for data returned for this schema
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password; // remove the password field
        // delete ret.__v  // Commented out because we're instead setting versionKey to false below
      },
      versionKey: false,
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

// This custom build function allows type checking on attrs.
// It will be available on the model if defined on the schema's statics object
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// The User mongoose model
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
