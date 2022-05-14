import mongoose, { Schema, Document } from 'mongoose';

export interface ICredentialItem extends Document {
  phone: string
  password: string
  telegramChatId: string
  isAdmin: boolean
  isEnabled: boolean
}

const CredentialItemSchema: Schema = new Schema({
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  telegramChatId: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  isEnabled: {
    type: Boolean,
    required: true
  },
}, { collection: 'credentials' });

export default mongoose.model<ICredentialItem>('CredentialItem', CredentialItemSchema);