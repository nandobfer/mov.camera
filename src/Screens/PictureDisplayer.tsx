import React from "react"
import { Dimensions, ImageBackground, TouchableOpacity, View } from "react-native"
import { FontAwesome } from "@expo/vector-icons"

interface PictureDisplayerProps {
    uri: string
    reset: () => void
    ratio: string
}

export const PictureDisplayer: React.FC<PictureDisplayerProps> = ({ uri, reset, ratio }) => {
    const { width } = Dimensions.get("screen")
    const height = Math.round((width * Number(ratio.split(":")[0])) / Number(ratio.split(":")[1]))

    return (
        <ImageBackground
            source={{ uri }}
            style={{ width, height: height, position: "absolute", top: 0, left: 0, padding: 25, justifyContent: "flex-end", alignItems: "center" }}
        >
            <TouchableOpacity onPress={reset}>
                <FontAwesome name="undo" size={36} color="red" />
            </TouchableOpacity>
        </ImageBackground>
    )
}
