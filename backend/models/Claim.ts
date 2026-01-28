import mongoose, { Schema, Document } from 'mongoose';

export interface IClaimEntity extends Document {
    beneficiary_id: mongoose.Types.ObjectId;
    asset_reference_id: mongoose.Types.ObjectId;
    claim_timestamp: Date;
}

const ClaimSchema = new Schema<IClaimEntity>({
    beneficiary_id: { type: Schema.Types.ObjectId, ref: 'CoreUser', required: true },
    asset_reference_id: { type: Schema.Types.ObjectId, ref: 'CorePerk', required: true },
    claim_timestamp: { type: Date, default: Date.now }
});

export const EntityClaim = mongoose.model<IClaimEntity>('CoreClaim', ClaimSchema);
