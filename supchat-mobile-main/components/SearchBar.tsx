import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function SearchBar({
                                      value,
                                      onChange,
                                  }: {
    value: string;
    onChange: (text: string) => void;
}) {
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Rechercher un utilisateur..."
                style={styles.input}
                value={value}
                onChangeText={onChange}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#fff',
    },
    input: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
    },
});
