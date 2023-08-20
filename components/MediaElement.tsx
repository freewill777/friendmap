import { useEffect, useState } from "react";
import { Dimensions, ImageStyle, StyleProp, ViewStyle } from "react-native";
import { host } from "../appData";
import { Image } from "expo-image";
import { ResizeMode, Video } from "expo-av";

type MediaElementProps = {
    elementIndex: number,
    setElementIndex?: React.Dispatch<React.SetStateAction<number>>,
    userId: string,
    url?: string,
    onError?: () => void,
    roundBorder?: boolean,
    style?: StyleProp<ViewStyle> | ImageStyle | ImageStyle[],
    shouldPlay?: boolean
}

export const MediaElement = ({
    elementIndex,
    userId: id,
    url,
    onError,
    roundBorder = true,
    style,
    shouldPlay = false
}: MediaElementProps) => {
    const { width, height } = Dimensions.get("window");
    const [mode, setMode] = useState<'img' | 'video'>('img')
    const [loading, setLoading] = useState(true);
    const [uri, setUri] = useState<string | undefined>(undefined)
    const address = url ? url : `${host}/media?userId=${id}&index=${elementIndex}`

    useEffect(() => {
        fetch(address)
            .then(response => {
                const responseFile = response._bodyInit._data.name as string
                if (responseFile.includes('.html') && onError) onError()
                if (response.headers.get('content-type')?.startsWith('image/')) {
                    setMode('img');
                } else if (response.headers.get('content-type')?.startsWith('video/')) {
                    setMode('video');
                }
                return response.url;
            })
            .then(mediaUri => {
                setUri(mediaUri);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching resource:', error);
            });
    }, [url]);

    if (!loading && uri) {
        if (mode === 'img') return (
            <Image
                cachePolicy='none'
                source={{ uri }}
                style={{
                    width: width,
                    height: height / 4,
                    marginTop: 10,
                    ...(roundBorder && {
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        borderTopRightRadius: width / 10,
                        borderBottomRightRadius: width / 10
                    }),
                    ...style
                }}
                key={elementIndex + 'image'}
            />
        )
        if (mode === 'video') return (
            <>
                <Video
                    source={{ uri }}
                    useNativeControls={!shouldPlay}
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    style={{
                        width: width,
                        height: height / 4,
                        marginTop: 10,
                        ...(roundBorder && {
                            borderTopLeftRadius: 20,
                            borderBottomLeftRadius: 20,
                            borderTopRightRadius: width / 10,
                            borderBottomRightRadius: width / 10
                        }),
                        ...style

                    }}
                    key={elementIndex + 'video'}
                    shouldPlay={shouldPlay}
                />
            </>
        )
    } else {
        return <></>
    }
}