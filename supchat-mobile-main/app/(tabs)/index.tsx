import { Image } from 'expo-image';
import {
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
} from 'react-native';

const workspaces = [
    { id: '1', name: 'Développement' },
    { id: '2', name: 'Marketing' },
    { id: '3', name: 'Support' },
];

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={workspaces}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Image
                            source={require('@/assets/images/partial-react-logo.png')}
                            style={styles.reactLogo}
                        />
                        <Text style={styles.title}>Espaces de travail</Text>
                    </View>
                }
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
    },
    item: {
        padding: 15,
        backgroundColor: '#eee',
        marginBottom: 10,
        borderRadius: 8,
    },
    itemText: {
        fontSize: 18,
    },
    reactLogo: {
        height: 120,
        width: 200,
        resizeMode: 'contain',
    },
});
