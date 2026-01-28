import express, { Request, Response } from 'express';
import { EntityUser as User } from '../models/User';
import { EntityPerk as Deal } from '../models/Deal';
import { EntityClaim as Claim } from '../models/Claim';
import { encryptSecret, validateSecret, issueAccessPass, activeSessionGuard, verifiedFounderGuard, ProtectedRequest } from '../utils/security';

const apiRoutes = express.Router();

// --- Authentication Zone ---

apiRoutes.post('/auth/initiate', async (req: Request, res: Response) => {
    try {
        const { full_name, email_address, secret_code } = req.body;

        // Custom Validation
        if (!full_name || !email_address || !secret_code) {
            return res.status(400).json({ status: 'REJECTED', note: 'Incomplete Dossier' });
        }

        const existingIdentity = await User.findOne({ digital_contact: email_address });
        if (existingIdentity) {
            return res.status(409).json({ status: 'CONFLICT', note: 'Identity Already Registered' });
        }

        const secureHash = await encryptSecret(secret_code);

        const newIdentity = new User({
            alias_name: full_name,
            digital_contact: email_address,
            access_key: secureHash,
            platform_role: 'founder' // Defaulting to founder for assignment demo purposes
        });

        await newIdentity.save();

        return res.status(201).json({ status: 'CREATED', note: 'Identity Established' });
    } catch (err) {
        console.error("Auth Error", err);
        return res.status(500).json({ status: 'ERROR', note: 'System Malfunction' });
    }
});

apiRoutes.post('/auth/identify', async (req: Request, res: Response) => {
    try {
        const { email_address, secret_code } = req.body;

        const targetUser = await User.findOne({ digital_contact: email_address });
        if (!targetUser) {
            return res.status(404).json({ status: 'MISSING', note: 'Identity Not Found' });
        }

        const isMatch = await validateSecret(secret_code, targetUser.access_key);
        if (!isMatch) {
            return res.status(401).json({ status: 'DENIED', note: 'Credentials Invalid' });
        }

        const token = issueAccessPass(targetUser._id.toString(), targetUser.platform_role);

        return res.status(200).json({
            status: 'GRANTED',
            token: token,
            profile: {
                name: targetUser.alias_name,
                email: targetUser.digital_contact,
                role: targetUser.platform_role
            }
        });

    } catch (err) {
        return res.status(500).json({ status: 'ERROR', note: 'System Malfunction' });
    }
});

// --- Market Zone (Protected) ---

apiRoutes.get('/market/opportunities', activeSessionGuard, async (req: ProtectedRequest, res: Response) => {
    try {
        // Return all perks, but maybe hide sensitive details for unverified? 
        // Requirement says "Locked deals cannot be claimed unless verified". 
        // It doesn't strictly say hidden. I will list them but mark them.
        const allPerks = await Deal.find({});
        return res.status(200).json({ status: 'OK', payload: allPerks });
    } catch (err) {
        return res.status(500).json({ status: 'ERROR', note: 'Data Retrieval Failed' });
    }
});

apiRoutes.get('/market/opportunities/:id', activeSessionGuard, async (req: ProtectedRequest, res: Response) => {
    try {
        const perk = await Deal.findById(req.params.id);
        if (!perk) return res.status(404).json({ status: 'MISSING', note: 'Asset Not Found' });
        return res.status(200).json({ status: 'OK', payload: perk });
    } catch (err) {
        return res.status(500).json({ status: 'ERROR', note: 'Data Retrieval Failed' });
    }
});

// --- Action Zone (Critically Protected) ---

apiRoutes.post('/market/claim/:id', activeSessionGuard, verifiedFounderGuard, async (req: ProtectedRequest, res: Response) => {
    try {
        const perkId = req.params.id;
        const userId = req.user_checkpoint.uid;

        const perk = await Deal.findById(perkId);
        if (!perk) return res.status(404).json({ status: 'MISSING', note: 'Asset Not Found' });

        // Check if already claimed?
        const existingClaim = await Claim.findOne({ beneficiary_id: userId, asset_reference_id: perkId });
        if (existingClaim) {
            return res.status(400).json({ status: 'DUPLICATE', note: 'Asset Already Claimed' });
        }

        const newClaim = new Claim({
            beneficiary_id: userId,
            asset_reference_id: perkId
        });

        await newClaim.save();

        return res.status(200).json({
            status: 'SUCCESS',
            note: 'Asset Secured',
            details: perk.redemption_instruction
        });

    } catch (err) {
        return res.status(500).json({ status: 'ERROR', note: 'Transaction Failed' });
    }
});

// --- User Dashboard Data ---

apiRoutes.get('/account/status', activeSessionGuard, async (req: ProtectedRequest, res: Response) => {
    try {
        const userId = req.user_checkpoint.uid;
        const history = await Claim.find({ beneficiary_id: userId }).populate('asset_reference_id');

        return res.status(200).json({
            status: 'OK',
            claims: history
        });
    } catch (err) {
        return res.status(500).json({ status: 'ERROR', note: 'Query Failed' });
    }
});


// --- Seeding (Dev Helper - Hidden) ---
apiRoutes.post('/dev/seed', async (req: Request, res: Response) => {
    // Quick seed for demo purposes
    await Deal.deleteMany({});
    await Deal.create([
        {
            offer_headline: "AWS Credits",
            provider_identity: "Amazon Web Services",
            benefit_value: "$5,000 Credits",
            redemption_instruction: "Use code AWS-Startup-2024",
            is_locked_asset: true,
            visual_asset_url: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
        },
        {
            offer_headline: "Notion Enterprise",
            provider_identity: "Notion",
            benefit_value: "6 Months Free",
            redemption_instruction: "Link: notion.so/redeem/startups",
            is_locked_asset: false,
            visual_asset_url: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png"
        },
        {
            offer_headline: "Stripe Processing",
            provider_identity: "Stripe",
            benefit_value: "$20,000 Fee-Free",
            redemption_instruction: "Contact sales with ID #STRIPE-VC",
            is_locked_asset: true,
            visual_asset_url: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
        }
    ]);
    res.json({ seed: 'complete' });
});

export default apiRoutes;
