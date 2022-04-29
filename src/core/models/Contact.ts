import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'
import { Base } from '@typegoose/typegoose/lib/defaultClasses'

@modelOptions({
	schemaOptions: { timestamps: true, collection: 'contacts', toObject: { virtuals: true }, toJSON: { virtuals: true } }
})
class IContact extends Base {
	@prop({ required: true })
	public fullName!: string

	@prop({ required: true })
	public email!: string

	@prop({ required: true })
	public whatsapp!: string
}

const Contact = getModelForClass(IContact)

export { Contact, IContact }
