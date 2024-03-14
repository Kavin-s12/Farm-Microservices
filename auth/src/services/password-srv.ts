import bcrypt from "bcryptjs";

export class Password {
  static async toHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  }

  static async compare(storedPasword: string, suppliedPasssword: string) {
    return await bcrypt.compare(storedPasword, suppliedPasssword);
  }
}
