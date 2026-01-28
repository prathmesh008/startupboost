import mongoose from 'mongoose';

// Establishes a persistent link to the data store
export const establishDataLink = async (): Promise<void> => {
    try {
        const connectionUri = process.env.DATA_STORE_URI || 'mongodb://localhost:27017/startup_boost_core';

        await mongoose.connect(connectionUri);

        console.log(">> Core System: Data Link Active");
    } catch (err) {
        console.error(">> Core System: Data Link Ruptured", err);
        process.exit(1);
    }
};
