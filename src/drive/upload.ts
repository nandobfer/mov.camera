import { CameraCapturedPicture } from "expo-camera"
import base64js from "base64-js"
import axios from "axios"

export const uploadToDrive = async (accessToken: string, picture: CameraCapturedPicture, fileName: string) => {
    try {
        console.log("starting upload")

        const byteBuffers = base64js.toByteArray(picture.base64!)
        const response = await axios({
            method: "post",
            url: `https://www.googleapis.com/upload/drive/v3/files`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "image/jpeg",
                "Content-Length": byteBuffers.length,
            },
            data: byteBuffers,
        })

        console.log(response.data)
        const fileId = response.data.id // Get the file ID from the upload response

        console.log("updating file metadata")

        await updateFileMetadataAndMove(fileId, accessToken, fileName, "16p9XspLOFMDXpO6vFw4urwrQ9oJjs1dQ")

        return true
    } catch (error) {
        console.log(error)
        return
    }
}

interface UpdateMetadataResponse {
    data: {
        id: string
        name: string
        parents?: string[]
    }
}

const updateFileMetadataAndMove = async (fileId: string, accessToken: string, newName: string, newParentId: string): Promise<void> => {
    try {
        // Update the file's name
        const updateResponse: UpdateMetadataResponse = await axios.patch(
            `https://www.googleapis.com/drive/v3/files/${fileId}`,
            { name: newName },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        )

        console.log("File name updated successfully:", updateResponse.data)

        // Optionally move the file to a new folder if newParentId is provided
        const moveResponse: UpdateMetadataResponse = await axios.patch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?addParents=${newParentId}`,
            {}, // No body required for parent update
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )

        console.log("File moved successfully:", moveResponse.data)
    } catch (error: any) {
        console.error("Failed to update metadata or move file:", error?.response ? error.response.data : error?.message)
    }
}
