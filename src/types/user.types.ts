// Interface for User document
export interface IUser {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    password: string;
    isVerified: boolean
    profilepicture?: string;
    googleId: string,
    githubId: string
    createdAt: Date;
    updatedAt: Date;
  }