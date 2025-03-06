export interface profileInterface {
    id: string;
    fullName: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    middleName: string;
    lastName: string;
    picture: string;
    DOB: string;
    pronouns: string;
}

export type UserUpdateData = Partial<{
    fullName: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    pronouns: string;
    DOB: string;
    picture: string;
}>