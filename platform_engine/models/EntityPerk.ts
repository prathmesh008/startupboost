import mongoose, { Schema, Document } from 'mongoose';

export interface IPerkEntity extends Document {
    offer_headline: string; // Title
    provider_identity: string; // Company Name
    benefit_value: string; // e.g., "$5000 Credits"
    redemption_instruction: string; // Description/Code info
    is_locked_asset: boolean; // Requires verification?
    visual_asset_url: string; // Logo/Image
}

const PerkSchema = new Schema<IPerkEntity>({
    offer_headline: { type: String, required: true },
    provider_identity: { type: String, required: true },
    benefit_value: { type: String, required: true },
    redemption_instruction: { type: String, required: true },
    is_locked_asset: { type: Boolean, default: true },
    visual_asset_url: { type: String, default: '' }
});

export const EntityPerk = mongoose.model<IPerkEntity>('CorePerk', PerkSchema);
