import mongoose, { Schema, Document } from 'mongoose';

export interface IUserEntity extends Document {
    alias_name: string; // Full name
    digital_contact: string; // Email
    access_key: string; // Password (hashed)
    is_vetted_founder: boolean; // Verified status
    platform_role: 'initiate' | 'founder' | 'admin';
    created_timeline: Date;
}

const UserSchema = new Schema<IUserEntity>({
    alias_name: { type: String, required: true },
    digital_contact: { type: String, required: true, unique: true },
    access_key: { type: String, required: true },
    is_vetted_founder: { type: Boolean, default: false },
    platform_role: { type: String, enum: ['initiate', 'founder', 'admin'], default: 'initiate' },
    created_timeline: { type: Date, default: Date.now }
});

export const EntityUser = mongoose.model<IUserEntity>('CoreUser', UserSchema);
