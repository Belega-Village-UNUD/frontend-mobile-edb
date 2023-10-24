import { StatusBar } from 'expo-status-bar';
import { Text, SafeAreaView } from 'react-native';

export default function App() {
    return (
        <SafeAreaView className='flex-1 justify-center items-center bg-red-200'>
            <Text>Init FE Mobile</Text>
            <StatusBar style='auto' />
        </SafeAreaView>
    );
}
