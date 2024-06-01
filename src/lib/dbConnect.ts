import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

export async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log('Already connected to DB')
        return
    }
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI!)
        // console.log(response)
        connection.isConnected = db.connections[0].readyState
        console.log('DB connected succesfully')
    }catch(err){
        console.log("DB conncetion failed ",err)
        process.exit(1)
    }

    const db = await mongoose.connect(process.env.MONGODB_URI!)
    connection.isConnected = db.connections[0].readyState
}

export default dbConnect