import React, { useEffect, useRef, useState } from "react"
import { Dimensions, Platform, Text, TouchableOpacity, View } from "react-native"
import { Camera, CameraCapturedPicture, CameraType, VideoStabilization } from "expo-camera"
import { FontAwesome } from "@expo/vector-icons"
import { PictureDisplayer } from "./PictureDisplayer"
import { MaterialIcons } from "@expo/vector-icons"

interface CameraComponentProps {}

export const CameraComponent: React.FC<CameraComponentProps> = ({}) => {
    const cameraRef = useRef<Camera>(null)

    const { width } = Dimensions.get("screen")

    const [recording, setRecording] = useState(false)
    const [cameraKey, setCameraKey] = useState(1)
    const [cameraType, setCameraType] = useState<"photo" | "video">("photo")
    const [ready, setReady] = useState(false)
    const [type, setType] = useState<CameraType>(CameraType.back)
    const [ratio, setRatio] = useState<"16:9" | "4:3" | "1:1">("16:9")
    const [picture, setPicture] = useState<CameraCapturedPicture | null>(null)

    const height = Math.round((width * Number(ratio.split(":")[0])) / Number(ratio.split(":")[1]))

    const toggleType = () => setType((type) => (type == CameraType.back ? CameraType.front : CameraType.back))

    const handlePlay = () => {
        if (!ready) return
        setRecording(true)
        cameraRef.current?.recordAsync().then((video) => {})
    }

    const handleStop = () => {
        if (!ready) return
        setRecording(false)
        cameraRef.current?.stopRecording()
    }

    const handleShoot = () => {
        if (!ready) return

        cameraRef.current?.takePictureAsync({ exif: true, skipProcessing: true, base64: true }).then((picture) => {
            console.log(picture)
            setPicture(picture)
        })
    }

    return (
        <>
            <Camera
                key={cameraKey}
                ref={cameraRef}
                type={type}
                style={{ position: "absolute", top: 0, left: 0, width, height, padding: 20, alignItems: "center" }}
                ratio={ratio}
                videoStabilizationMode={VideoStabilization.auto}
                onCameraReady={() => setReady(true)}
            ></Camera>
            <TouchableOpacity style={{ position: "absolute", top: 50, alignSelf: "center" }} onPress={toggleType}>
                <MaterialIcons name="flip-camera-android" size={36} color="red" />
            </TouchableOpacity>
            <View style={{ position: "absolute", top: 50, right: 50, alignItems: "center", gap: 10 }}>
                <TouchableOpacity onPress={() => setRatio("16:9")} style={{ opacity: ratio == "16:9" ? 1 : 0.15 }}>
                    <Text style={{ color: "red" }}>16:9</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setRatio("4:3")} style={{ opacity: ratio == "4:3" ? 1 : 0.15 }}>
                    <Text style={{ color: "red" }}>4:3</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setRatio("1:1")} style={{ opacity: ratio == "1:1" ? 1 : 0.15 }}>
                    <Text style={{ color: "red" }}>1:1</Text>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    width: "100%",
                    position: "absolute",
                    top: height * 0.9,
                    left: 0,
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 50,
                    alignItems: "center",
                }}
            >
                <TouchableOpacity onPress={() => setCameraType("photo")} style={{ opacity: cameraType == "video" ? 0.15 : 1 }}>
                    <FontAwesome name="camera" size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        borderColor: "white",
                        borderWidth: 1,
                        borderRadius: recording ? 5 : 100,
                        width: 50,
                        height: 50,
                        backgroundColor: "red",
                        opacity: recording ? 0.3 : 1,

                        alignSelf: "center",
                    }}
                    onPress={cameraType == "photo" ? handleShoot : recording ? handleStop : handlePlay}
                ></TouchableOpacity>
                <TouchableOpacity onPress={() => setCameraType("video")} style={{ opacity: cameraType == "photo" ? 0.15 : 1 }}>
                    <FontAwesome name="video-camera" size={24} color="red" />
                </TouchableOpacity>
            </View>
            {picture && <PictureDisplayer picture={picture} reset={() => setPicture(null)} ratio={ratio} />}
        </>
    )
}
