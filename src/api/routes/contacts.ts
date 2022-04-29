import { Router } from 'express'

import ContactContoller from '../controllers/contacts'

class ContactRoutes {
	public router: Router

	constructor() {
		this.router = Router()
	}

	registerRoutes() {
		this.createContact()
		this.getContacts()
	}

	createContact() {
		this.router.route('/').post(ContactContoller.createContact)
	}

	getContacts() {
		this.router.route('/').get(ContactContoller.getContacts)
	}
}

const contactRoutes = new ContactRoutes()
contactRoutes.registerRoutes()

export default contactRoutes.router
