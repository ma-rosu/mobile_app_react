import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const VIDEO_URL = 'https://2376ef63e32c.eu-central-1.playback.live-video.net/api/video/v1/eu-central-1.758280787484.channel.ZXSSSG5ydeDl.m3u8';

export default function VideoPlayer() {
    const videoRef = useRef<Video>(null);
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stuckCount, setStuckCount] = useState(0);
    const previousPosition = useRef(0);

    
    useEffect(() => {
        const interval = setInterval(async () => {
            if (!videoRef.current || hasError) return;

            try {
                const status = await videoRef.current.getStatusAsync();
                if (!status.isLoaded) return;

                const { isPlaying, positionMillis } = status;

                if (positionMillis === previousPosition.current && !isPlaying) {
                    setStuckCount((prev) => prev + 1);
                } else {
                    setStuckCount(0);
                }

                previousPosition.current = positionMillis;

                if (stuckCount >= 3) {
                    console.warn('Video appears stuck. Showing refresh.');
                    setHasError(true);
                }
            } catch (e) {
                console.error('Error while checking video status:', e);
                setHasError(true);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [hasError, stuckCount]);

    
    const handleReload = async () => {
        setHasError(false);
        setLoading(true);
        setStuckCount(0);
        previousPosition.current = 0;

        try {
            await videoRef.current?.unloadAsync();
            await videoRef.current?.loadAsync(
                { uri: VIDEO_URL },
                { shouldPlay: true }
            );
        } catch (e) {
            console.log('Reload error:', e);
            setHasError(true);
        }

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {hasError ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Something happened. Tap to refresh.</Text>
                    <TouchableOpacity onPress={handleReload} style={styles.button}>
                        <Text style={styles.buttonText}>Refresh</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    {loading && <ActivityIndicator size="large" color="#fff" />}
                    <Video
                        ref={videoRef}
                        source={{ uri: VIDEO_URL }}
                        shouldPlay
                        resizeMode={ResizeMode.CONTAIN}
                        useNativeControls={false}
                        isLooping={false}
                        onLoadStart={() => setLoading(true)}
                        onReadyForDisplay={() => setLoading(false)}
                        onError={(e) => {
                            console.log('Video error:', e);
                            setHasError(true);
                        }}
                        style={styles.video}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    video: {
        width: '100%',
        height: 300,
        backgroundColor: '#000',
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    errorText: {
        color: '#fff',
        marginBottom: 15,
        fontSize: 16,
        textAlign: 'center',
    },
    button: {
        padding: 10,
        backgroundColor: '#444',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
    },
});
