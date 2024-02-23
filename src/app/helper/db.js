import mongoose from "mongoose";

export const connectDB = async () => {

    try {
        const { connection } = await mongoose.connect(process.env.DB_URL, {
            dbName: "odbhootStore"
        });


        console.log("Connected to DB....");
        // console.log(connection);
    }
    catch (error) {
        console.log("Failed to connect to DB!");
        console.log(error)
    }
}