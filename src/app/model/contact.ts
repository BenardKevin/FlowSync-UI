import { Address } from "./address"

interface Contact {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    phoneNumber: string
    address: Address,

}

export type { Contact }