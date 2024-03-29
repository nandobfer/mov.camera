import React, { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Button, Platform, Text, View } from "react-native"
import * as AuthSession from "expo-auth-session"
import * as Google from "expo-auth-session/providers/google"
import AsyncStorage from "@react-native-async-storage/async-storage"
import google_secret_android from "../google_client_secret_android.json"
import google_secret_ios from "../google_client_secret_ios.json"
import UserContext from "../contexts/userContext"

interface AuthenticationProps {
    setToken: React.Dispatch<React.SetStateAction<string>>
}

export const Authentication: React.FC<AuthenticationProps> = ({ setToken }) => {
    const { user, setUser } = useContext(UserContext)

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: Platform.OS == "ios" ? google_secret_ios.client_id : google_secret_android.installed.client_id,
        selectAccount: true,
        scopes: ["https://www.googleapis.com/auth/drive"],
    })

    const storeTokens = async (accessToken: string, refreshToken?: string, expiresIn?: number) => {
        const currentTime = new Date().getTime() // Current time in milliseconds
        const expirationTime = currentTime + (expiresIn || 0) * 1000 // Convert expiresIn to milliseconds and add

        console.log({ accessToken, refreshToken, expirationTime })

        await AsyncStorage.setItem("accessToken", accessToken)
        await AsyncStorage.setItem("refreshToken", refreshToken || "")
        await AsyncStorage.setItem("expirationTime", expirationTime?.toString() || "")
        setToken(accessToken)
    }

    const refreshToken = async () => {
        console.log("refreshing?")
        try {
            const tokenResult = await AuthSession.refreshAsync(
                {
                    clientId: google_secret_android.installed.client_id,
                    refreshToken: (await AsyncStorage.getItem("refreshToken")) as string,
                },
                {
                    tokenEndpoint: "https://googleapis.com/oauth2/v4/token",
                }
            )

            console.log(JSON.stringify({ tokenResult }, null, 4))

            storeTokens(tokenResult.accessToken, tokenResult.refreshToken, tokenResult.expiresIn)
            return tokenResult.accessToken
        } catch (error) {
            console.log(error)
        }
    }

    async function getToken() {
        const expirationTime = await AsyncStorage.getItem("expirationTime")
        console.log({ expirationTime, now: new Date().getTime(), expired: new Date().getTime() > Number(expirationTime) })
        if (expirationTime && new Date().getTime() > parseInt(expirationTime)) {
            // Token is expired or not found, refresh it
            console.log("Token is expired. Refreshing...")
            return await refreshToken()
        } else {
            // Token is still valid
            console.log("token still valid")
            // return await AsyncStorage.getItem("accessToken")
            return false
        }
    }

    const getUserInfo = async (token: string) => {
        //absent token
        if (!token) return
        //present token
        try {
            const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
            const user = await response.json()
            console.log(user)
            //store user information  in Asyncstorage
            setUser(user)
        } catch (error) {
            console.error("Failed to fetch user data:", response)
        }
    }

    const signInWithGoogle = async () => {
        try {
            if (response?.type === "success") {
                // If no user information is found and the response type is "success" (assuming response is defined),
                // call getUserInfo with the access token from the response

                if (response.authentication) {
                    console.log(JSON.stringify(response.authentication, null, 4))
                    storeTokens(response.authentication.accessToken, response.authentication.refreshToken, response.authentication.expiresIn)
                }

                getUserInfo(response?.authentication?.accessToken || "")
            }
        } catch (error) {
            // Handle any errors that occur during AsyncStorage retrieval or other operations
            console.error("Error retrieving user data from AsyncStorage:", error)
        }
    }

    const validateToken = async () => {
        const token = await getToken()
        if (!token) {
            console.log("No token found")
            // Token not found, user needs to log in
            setUser(undefined)
            return
        }

        setToken(token)

        // If token is still valid, fetch user info
        getUserInfo(token)
    }

    //add it to a useEffect with response as a dependency
    useEffect(() => {
        signInWithGoogle()
    }, [response])

    useEffect(() => {
        validateToken()
    }, [])

    return (
        <View style={{ alignItems: "center", flex: 1, justifyContent: "center", gap: 25 }}>
            <Text style={{ color: "red" }}>necessário autenticar com google</Text>
            {user ? (
                <ActivityIndicator size={36} color={"red"} />
            ) : (
                <Button
                    title="entrar"
                    color={"red"}
                    onPress={() => {
                        promptAsync()
                    }}
                />
            )}
        </View>
    )
}
