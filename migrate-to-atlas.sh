#!/bin/bash

echo "========================================"
echo "FIT ZONE - Database Migration Script"
echo "========================================"
echo ""

echo "Step 1: Exporting data from localhost..."
echo ""
mongodump --uri="mongodb://localhost:27017/fitzone" --out="./backup"

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to export data from localhost"
    echo "Make sure MongoDB is running on localhost:27017"
    exit 1
fi

echo ""
echo "✅ Export completed successfully!"
echo ""
echo "Step 2: Importing data to MongoDB Atlas..."
echo ""

mongorestore --uri="mongodb+srv://akhileshagsmg_db_user:Akhilesh@2003@cluster0.rto06lr.mongodb.net/fitzone?retryWrites=true&w=majority" ./backup/fitzone

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import data to MongoDB Atlas"
    echo "Check your internet connection and credentials"
    exit 1
fi

echo ""
echo "========================================"
echo "✅ Migration completed successfully!"
echo "========================================"
echo ""
echo "Your data has been migrated to MongoDB Atlas"
echo ""
echo "Next steps:"
echo "1. Update Backend/.env file with new connection string"
echo "2. Restart your backend server"
echo "3. Test the application"
echo ""
