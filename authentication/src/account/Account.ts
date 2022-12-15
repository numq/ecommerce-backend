import {CredentialType} from "../confirmation/CredentialType";
import {Role} from "./Role";

export type Account = {
    id: string;
    credentials: string;
    credentialType: CredentialType;
    role: Role;
    createdAt: number;
    updatedAt: number;
};