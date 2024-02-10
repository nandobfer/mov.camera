import React from "react"
import { Dimensions, ImageBackground, TouchableOpacity, View } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { CameraCapturedPicture } from "expo-camera"

interface PictureDisplayerProps {
    picture: CameraCapturedPicture
    reset: () => void
    ratio: string
}

export const PictureDisplayer: React.FC<PictureDisplayerProps> = ({ picture, reset, ratio }) => {
    const { width } = Dimensions.get("screen")
    const height = Math.round((width * Number(ratio.split(":")[0])) / Number(ratio.split(":")[1]))

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
                <TouchableOpacity onPress={reset}>
                    <FontAwesome name="undo" size={36} color="red" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <FontAwesome name="cloud-upload" size={36} color="red" />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}
