#!/bin/bash

# Register
echo "Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "password123", "name": "Test User"}')
echo $REGISTER_RESPONSE

# Login
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "password123"}')
echo $LOGIN_RESPONSE
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | grep -o '[^"]*$')
echo "Token: $TOKEN"

# Get Balance
echo "Getting Balance..."
curl -s -X GET http://localhost:3000/wallet/balance -H "Authorization: Bearer $TOKEN"
echo ""

# Buy Coin
echo "Buying Coin..."
curl -s -X POST http://localhost:3000/wallet/buy -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"coinId": "bitcoin", "amount": 0.1, "price": 50000}'
echo ""

# Get Balance Again
echo "Getting Balance Again..."
curl -s -X GET http://localhost:3000/wallet/balance -H "Authorization: Bearer $TOKEN"
echo ""
