import mongoose from "mongoose";

type ConnectionObject = {
    isConnected ?:  number;
}

const connection : ConnectionObject = {}

async function dbConnect(): Promise<void> { //here the void meanig is different , it is actually what ever date is come it dont care
    if(connection.isConnected) {
        console.log("already connected")
        return 
    }

    try {
        const dbConnectionInstance = await mongoose.connect(process.env.MONGO_URI || '',{})

        connection.isConnected = dbConnectionInstance.connections[0].readyState

        console.log("DB CONNECTED SUCCESSFULLY");
        
    } catch(error) { 
        console.log("Database connection failed",error);
        process.exit(1)
    }
}

export default dbConnect