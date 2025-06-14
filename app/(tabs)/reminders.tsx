import { Text, View, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView, Platform } from "react-native";
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';


interface TimeDetailEntry {
    time: string; 
    detail: string;
}

interface AllEntriesResponse {
    entries: TimeDetailEntry[];
}

interface MessageResponse {
    message: string;
    error?: string;
}


const EC2_API_URL = 'http://18.197.7.3:5000'; 

const Reminders = () => {
    
    const [entries, setEntries] = useState<TimeDetailEntry[]>(Array(6).fill({ time: '', detail: '' }));
    
    const [loading, setLoading] = useState<boolean>(false);
    
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
    
    const [currentEntryIndex, setCurrentEntryIndex] = useState<number>(0);

    
    useEffect(() => {
        fetchEntries();
    }, []);

    
    const fetchEntries = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${EC2_API_URL}/read-entries`); 
            const data: AllEntriesResponse | MessageResponse = await response.json();

            if (response.ok) {
                if ('entries' in data && Array.isArray(data.entries)) {
                    
                    
                    const fetched = data.entries.map(entry => ({
                        time: entry.time || '',
                        detail: entry.detail || ''
                    }));
                    setEntries([
                        ...fetched,
                        ...Array(6 - fetched.length).fill({ time: '', detail: '' })
                    ].slice(0, 6)); 
                } else {
                    Alert.alert('Eroare API', 'Răspuns invalid de la server la citirea intrărilor.');
                }
            } else {
                if ('error' in data) {
                    Alert.alert('Eroare', data.error || 'Nu s-au putut citi intrările.');
                } else {
                    Alert.alert('Eroare', 'Răspuns necunoscut la citirea intrărilor.');
                }
            }
        } catch (error) {
            console.error('Eroare rețea la citirea intrărilor:', error);
            Alert.alert('Eroare rețea', 'Nu s-a putut conecta la serverul EC2 sau a apărut o eroare la citirea intrărilor.');
        } finally {
            setLoading(false);
        }
    };

    
    const handleDetailChange = (index: number, value: string) => {
        const newEntries = [...entries];
        newEntries[index] = { ...newEntries[index], detail: value };
        setEntries(newEntries);
    };

    
    const handleTimeInputPress = (index: number) => {
        setCurrentEntryIndex(index);
        setShowTimePicker(true);
    };

    
    const onTimeChange = (event: any, selectedDate?: Date) => {
        
        setShowTimePicker(Platform.OS === 'ios');

        if (selectedDate) {
            const hours = String(selectedDate.getHours()).padStart(2, '0');
            const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
            const newTime = `${hours}:${minutes}`;

            const newEntries = [...entries];
            newEntries[currentEntryIndex] = { ...newEntries[currentEntryIndex], time: newTime };
            setEntries(newEntries);
        }
    };

    
    const saveEntries = async () => {
        setLoading(true);
        try {
            const formattedEntries = entries.map(entry => {
                
                
                
                return `${entry.time}|${entry.detail}`;
            });

            const response = await fetch(`${EC2_API_URL}/update-entries`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ entries: formattedEntries }),
            });
            const data: MessageResponse = await response.json();

            if (response.ok) {
                Alert.alert('Succes', data.message || 'Intrările au fost salvate cu succes!');
            } else {
                Alert.alert('Eroare', data.error || 'Nu s-au putut salva intrările.');
            }
        } catch (error) {
            console.error('Eroare rețea la salvarea intrărilor:', error);
            Alert.alert('Eroare rețea', 'Nu s-a putut conecta la serverul EC2 sau a apărut o eroare la salvarea intrărilor.');
        } finally {
            setLoading(false);
        }
    };

    const clearEntry = (index: number) => {
        const newEntries = [...entries];
        newEntries[index] = { time: '', detail: '' };
        setEntries(newEntries);
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Set Times and Events</Text>

            {loading ? (
                
                <ActivityIndicator size="large" color="#fff" />
            ) : (
                <>
                    {entries.map((entry, index) => (
                        <View key={index} style={styles.entryRow}>
                            {/* Time Display and Picker Trigger */}
                            <TextInput
                                style={[styles.input, styles.timeInput]}
                                value={entry.time}
                                placeholder="Alege Ora"
                                placeholderTextColor="#aaa" 
                                editable={true} 
                                onTouchStart={() => handleTimeInputPress(index)} 
                            />
                            {/* Detail Input */}
                            <TextInput
                                style={[styles.input, styles.detailInput]}
                                onChangeText={(text) => handleDetailChange(index, text)}
                                value={entry.detail}
                                placeholder="Detalii scurte"
                                placeholderTextColor="#aaa" 
                                maxLength={100} 
                            />
                            <Button
                                title="_"
                                color="#FF6347" 
                                onPress={() => {
                                    const newEntries = [...entries];
                                    newEntries[index] = { time: '', detail: '' };
                                    setEntries(newEntries);
                                }}
                            />
                        </View>
                    ))}

                    {/* Time Picker Component */}
                    {showTimePicker && (
                        <DateTimePicker
                            value={
                                
                                
                                entries[currentEntryIndex]?.time
                                    ? new Date(`2000-01-01T${entries[currentEntryIndex].time}:00`) 
                                    : new Date()
                            }
                            mode="time"
                            is24Hour={true} 
                            display="default" 
                            onChange={onTimeChange}
                        />
                    )}
                </>
            )}

            <View style={styles.saveButtonContainer}>
                <Button
                    title={loading ? "Saving..." : "Save Changes"}
                    onPress={saveEntries}
                    disabled={loading}
                    color="#2f8a00"
                />
            </View>

            <View style={styles.reloadButtonContainer}>
                <Button
                    title="Load from server"
                    onPress={fetchEntries}
                    disabled={loading}
                    color="#bb7d0a"
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1a1a1a', 
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff', 
    },
    entryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: '#666', 
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#333', 
        color: '#fff', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2, 
        shadowRadius: 3,
        elevation: 3,
    },
    timeInput: {
        flex: 0.3, 
        marginRight: 10,
    },
    detailInput: {
        flex: 0.65, 
    },
    reloadButtonContainer: {
        marginTop: 20,
    },
    saveButtonContainer: {
        marginTop: 20
    }
});

export default Reminders;
