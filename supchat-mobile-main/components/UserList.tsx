import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

type User = {
    _id: string;
    name: string;
    profilePicture: string;
};

export default function UserList({ searchQuery }: { searchQuery: string }) {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchQuery) {
                setUsers([]);
                return;
            }

            try {
                const response = await fetch(`http://192.168.1.30:5000/api/v1/users/search?query=${searchQuery}`);
                const data = await response.json();
                setUsers(data.users || []);
            } catch (error) {
                console.error('Erreur de recherche:', error);
            }
        };

        fetchUsers();
    }, [searchQuery]);

    const openChat = (userId: string) => {
        router.push({ pathname: '/chat/[userId]', params: { userId } });
    };

    return (
        <FlatList
            data={users}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => openChat(item._id)}>
                    <Text style={styles.name}>{item.name}</Text>
                </TouchableOpacity>
            )}
        />
    );
}

const styles = StyleSheet.create({
    item: {
        padding: 15,
        backgroundColor: '#eee',
        marginBottom: 10,
        borderRadius: 8,
    },
    name: {
        fontSize: 16,
    },
});
