import { StatusBar } from "expo-status-bar"
import { Alert, StyleSheet, Text, View } from "react-native"
import { useEffect, useState } from "react"
import * as SplashScreen from "expo-splash-screen"
import { Camera } from "expo-camera"
import { CameraComponent } from "./src/Screens/CameraComponent"
import { Authentication } from "./src/Screens/Authentication"
import { UserProvider } from "./src/contexts/userContext"

SplashScreen.preventAutoHideAsync()

const App = () => {
    const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions()
    const [audioPermission, requestAudioPermission] = Camera.useMicrophonePermissions()
    const [token, setToken] = useState("")

    useEffect(() => {
        if (!cameraPermission?.granted) {
            requestCameraPermission()
        }

        if (!audioPermission?.granted) {
            requestAudioPermission()
        }

        if (cameraPermission?.granted && audioPermission?.granted) {
            SplashScreen.hideAsync()
        }
    }, [cameraPermission, audioPermission])

    return cameraPermission?.granted && audioPermission?.granted ? (
        <View style={{ backgroundColor: "black", flex: 1 }}>
            <StatusBar style="auto" hidden />
            <UserProvider>{token ? <CameraComponent /> : <Authentication setToken={setToken} />}</UserProvider>
        </View>
    ) : (
        <View>
            <Text>o app precisa de permissão para acessar a câmera, microfone e galeria.</Text>
        </View>
    )
}

export default App
