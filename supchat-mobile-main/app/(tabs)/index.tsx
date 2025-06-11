import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Button,
    TextInput,
    Modal,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import UserList from '../../components/UserList';

export default function HomeScreen() {
    const [user, setUser] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const data = await AsyncStorage.getItem('user');
            if (data) {
                const parsed = JSON.parse(data);
                setUser(parsed);
                setEmail(parsed.email);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.clear();
        setShowModal(false);
        Alert.alert('Déconnecté');
    };

    const handleUpdateEmail = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await fetch('http://192.168.1.30:5000/api/v1/user/update-email', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Erreur');
            Alert.alert('Succès', 'Email mis à jour');
        } catch (err: any) {
            Alert.alert('Erreur', err.message);
        }
    };

    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword) {
            Alert.alert('Erreur', 'Remplis les deux champs');
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await fetch('http://192.168.1.30:5000/api/v1/user/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Erreur');
            Alert.alert('Succès', 'Mot de passe modifié');
        } catch (err: any) {
            Alert.alert('Erreur', err.message);
        }
    };

    if (!user) return <Text style={styles.loading}>Chargement...</Text>;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Accueil</Text>
                <TouchableOpacity onPress={() => setShowModal(true)}>
                    <Ionicons name="person-circle-outline" size={36} color="black" />
                </TouchableOpacity>
            </View>

            {/* FlatList = container principal */}
            <FlatList
                ListHeaderComponent={
                    <View>
                        <View style={styles.content}>
                            <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
                            <Text style={styles.name}>{user.name}</Text>
                            <Text style={styles.email}>{user.email}</Text>
                        </View>
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    </View>
                }
                data={[]} // Pas besoin d’items ici
                renderItem={null}
                ListFooterComponent={<UserList searchQuery={searchQuery} />
                }
            />

            {/* Modal */}
            <Modal visible={showModal} animationType="slide">
                <SafeAreaView style={styles.modalContent}>
                    <Text style={styles.title}>Modifier votre profil</Text>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <Button title="Mettre à jour l'email" onPress={handleUpdateEmail} />

                    <Text style={styles.label}>Ancien mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />

                    <Text style={styles.label}>Nouveau mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <Button title="Changer le mot de passe" onPress={handleUpdatePassword} />
                    <Button title="Se déconnecter" color="red" onPress={handleLogout} />
                    <Button title="Fermer" onPress={() => setShowModal(false)} />
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    loading: { marginTop: 50, textAlign: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    headerText: { fontSize: 20, fontWeight: 'bold' },
    content: { alignItems: 'center', marginTop: 20 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    name: { fontSize: 22, fontWeight: 'bold' },
    email: { fontSize: 16, color: 'gray' },
    modalContent: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    label: { marginTop: 20, fontWeight: 'bold' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
    },
});
