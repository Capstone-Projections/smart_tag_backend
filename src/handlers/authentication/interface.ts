export interface AuthenticateInput {
    email: string;
    emailToken: string;
}

export interface APITokenPayload {
    tokenId: number;
}

export interface LoginInput {
    email: string;
}
