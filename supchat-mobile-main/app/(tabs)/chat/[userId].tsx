// app/(tabs)/chat/[userId].tsx

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const socket = io('http://192.168.1.30:5000'); // ⚠️ Mets ici ton IP locale

export default function ChatWithUser() {
    const { userId } = useLocalSearchParams<{ userId: string }>();
    const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const connectSocket = async () => {
            const token = await AsyncStorage.getItem('token');
            const user = await AsyncStorage.getItem('user');
            if (user) {
                const { id } = JSON.parse(user);
                socket.emit('setup', id);
            }
        };

        connectSocket();

        socket.on('receive-message', (msg) => {
            if (msg.sender.id === userId || msg.receiverId === userId) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        return () => {
            socket.off('receive-message');
        };
    }, [userId]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const user = await AsyncStorage.getItem('user');
        if (!user) return;

        const sender = JSON.parse(user);
        const msg = {
            sender: sender.id,
            receiverId: userId,
            content: newMessage,
            channel: null,
            seenBy: [sender.id],
        };

        socket.emit('message', msg);
        setMessages((prev) => [...prev, { sender: sender.id, content: newMessage }]);
        setNewMessage('');
        flatListRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.message, item.sender === userId ? styles.them : styles.me]}>
                        <Text style={styles.text}>{item.content}</Text>
                    </View>
                )}
                contentContainerStyle={styles.messages}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Votre message"
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <Button title="Envoyer" onPress={sendMessage} />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    messages: { padding: 10 },
    message: {
        padding: 10,
        borderRadius: 8,
        marginVertical: 4,
        maxWidth: '80%',
    },
    me: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
    them: { backgroundColor: '#EEE', alignSelf: 'flex-start' },
    text: { fontSize: 16 },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        marginRight: 10,
    },
});
