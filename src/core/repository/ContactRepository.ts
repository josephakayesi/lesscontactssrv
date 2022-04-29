import { DocumentType } from '@typegoose/typegoose'
import { Contact, IContact } from '../models/Contact'

class ContactRepository {
	public static async find(): Promise<DocumentType<IContact>[] | null | undefined> {
		return await Contact.find()
	}
}

export default ContactRepository
