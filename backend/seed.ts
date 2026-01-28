import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { EntityUser as User } from './models/User';
import { EntityPerk as Deal } from './models/Deal';
import { EntityClaim as Claim } from './models/Claim';
import { encryptSecret } from './utils/security';

dotenv.config();

const performSeed = async () => {
    console.log('>> Seeding Sequence Initiated...');

    try {
        const mongoUri = process.env.DATA_STORE_URI;
        if (!mongoUri) throw new Error('DATA_STORE_URI missing in environment');

        await mongoose.connect(mongoUri);
        console.log('>> Database Link Established.');

        // 1. Purge Existing Records
        await Promise.all([
            User.deleteMany({}),
            Deal.deleteMany({}),
            Claim.deleteMany({})
        ]);
        console.log('>> Previous Data Purged.');

        // 2. Create Demo User
        const hashedKey = await encryptSecret('demo123');
        const demoUser = await User.create({
            alias_name: 'Demo Founder',
            digital_contact: 'founder@demo.com',
            access_key: hashedKey,
            is_vetted_founder: true,
            platform_role: 'founder'
        });
        console.log('>> Demo Identity Created: founder@demo.com');

        // 3. Populate Deals (Perks)
        const perksData = [
            {
                provider_identity: 'Amazon Web Services',
                offer_headline: '$5,000 in Cloud Credits',
                benefit_value: '$5,000 USD',
                redemption_instruction: 'Apply via console with code: STARTUP-AWS-202X',
                is_locked_asset: true,
                visual_asset_url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg'
            },
            {
                provider_identity: 'Stripe',
                offer_headline: '$20,000 Fee-Free Processing',
                benefit_value: '$20,000 Processed',
                redemption_instruction: 'Sign up link: dashboard.stripe.com/register/partner/startup-boost',
                is_locked_asset: true,
                visual_asset_url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg'
            },
            {
                provider_identity: 'Notion',
                offer_headline: '6 Months Free Plus Plan',
                benefit_value: '$6,000 Value',
                redemption_instruction: 'Redeem at notion.so/startups with code: NOTION-BOOST-6M',
                is_locked_asset: false,
                visual_asset_url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png'
            },
            {
                provider_identity: 'HubSpot',
                offer_headline: '90% Off for First Year',
                benefit_value: 'Up to $20k Savings',
                redemption_instruction: 'Contact sales via the partner portal link.',
                is_locked_asset: true,
                visual_asset_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/HubSpot_Logo.svg'
            },
            {
                provider_identity: 'Figma',
                offer_headline: 'Professional Plan Gratis',
                benefit_value: '12 Months Free',
                redemption_instruction: 'Upgrade workspace settings > billing > enter promo code.',
                is_locked_asset: false,
                visual_asset_url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg'
            },
            {
                provider_identity: 'Vercel',
                offer_headline: 'Pro Team Allocation',
                benefit_value: '$200/mo Credits',
                redemption_instruction: 'Auto-applied upon connecting Github Organization.',
                is_locked_asset: true,
                visual_asset_url: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png'
            }
        ];

        const perks = await Deal.insertMany(perksData);
        console.log(`>> Catalog Populated: ${perks.length} Assets.`);

        // 4. Create Sample Claims
        // Link AWS and Figma to the demo user
        const awsPerk = perks.find((p: any) => p.provider_identity === 'Amazon Web Services');
        const figmaPerk = perks.find((p: any) => p.provider_identity === 'Figma');

        if (awsPerk && figmaPerk) {
            await Claim.create([
                {
                    beneficiary_id: demoUser._id,
                    asset_reference_id: awsPerk._id,
                    claim_timestamp: new Date()
                },
                {
                    beneficiary_id: demoUser._id,
                    asset_reference_id: figmaPerk._id,
                    claim_timestamp: new Date(Date.now() - 86400000) // Yesterday
                }
            ]);
            console.log('>> Dummy Claims Filed.');
        }

        console.log('>> Seeding Complete. System Ready.');
        process.exit(0);

    } catch (err) {
        console.error('>> Seeding Failed:', err);
        process.exit(1);
    }
};

performSeed();
