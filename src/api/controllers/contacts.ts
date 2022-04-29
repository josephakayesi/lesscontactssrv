import { Request, Response, NextFunction } from 'express'
import { Contact, IContact } from '../../core/models/Contact'

class ContactController {
	async createContact(req: Request, res: Response, next: NextFunction) {
		try {
			const newContact = {
				fullName: req.body.fullName,
				email: req.body.email,
				whatsapp: req.body.whatsapp
			}

			const contact: IContact = await Contact.create(newContact)

			return res.status(201).json(contact)
		} catch (error) {
			// error.constant = 1004
			next(error)
		}
	}

	async getContacts(req: Request, res: Response, next: NextFunction) {
		try {
			const contacts = await Contact.find()

			return res.status(200).json(contacts)
		} catch (error) {
			// error.constant = 1004
			next(error)
		}
	}
}

export default new ContactController()
