import React, { useState } from "react"
import { ActivityIndicator, Alert, Dimensions, ImageBackground, TouchableOpacity, View } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { CameraCapturedPicture } from "expo-camera"
import { uploadToDrive } from "../drive/upload"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface PictureDisplayerProps {
    picture: CameraCapturedPicture
    reset: () => void
    ratio: string
}

export const PictureDisplayer: React.FC<PictureDisplayerProps> = ({ picture, reset, ratio }) => {
    const { width } = Dimensions.get("screen")
    const height = Math.round((width * Number(ratio.split(":")[0])) / Number(ratio.split(":")[1]))

    const [uploading, setUploading] = useState(false)

    const onUploadPress = async () => {
        setUploading(true)
        console.log("pressed upload")
        const expirationTime = await AsyncStorage.getItem("expirationTime")
        const user = JSON.parse((await AsyncStorage.getItem("user")) || "")

        if (!user || (expirationTime && new Date().getTime() > parseInt(expirationTime))) {
            Alert.alert("usuário expirou, fecha e abre de novo")
        }
        console.log(user)
        const token = await AsyncStorage.getItem("accessToken")

        const filename = `${user.given_name}.${new Date().toLocaleString("pt-br").replace(" ", ".")}`
        const uploaded = await uploadToDrive(token!, picture, filename)
        setUploading(false)

        if (uploaded) {
            Alert.alert("arquivo subido")
            reset()
        } else {
            Alert.alert("erro ao subir o arquivo")
        }
    }

    return (
        <ImageBackground
            source={{ uri: picture.uri }}
            style={{
                width: width,
                height: height,
                position: "absolute",
                top: 0,
                left: 0,
            }}
        >
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", gap: 100, alignItems: "flex-end", padding: 25 }}>
                <TouchableOpacity onPress={reset} disabled={uploading} style={{ opacity: uploading ? 0.15 : 1 }}>
                    <FontAwesome name="undo" size={36} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onUploadPress}>
                    {uploading ? <ActivityIndicator size={36} color={"red"} /> : <FontAwesome name="cloud-upload" size={36} color="red" />}
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}
