import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackBtn, Button } from '../components';
import styles from './styles/login.style';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { TouchableOpacity } from 'react-native';

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, 'Password terlalu pendek')
        .required('Password tidak boleh kosong'),

    email: Yup.string()
        .email('Email tidak valid')
        .required('Email tidak boleh kosong'),
});

export default function LoginScreen({ navigation }) {
    const [loader, setLoader] = useState(false);
    const [response, setResponse] = useState(null);
    const [obsecureText, setObsecureText] = useState(false);

    return (
        <ScrollView>
            <SafeAreaView style={{ marginHorizontal: 20 }}>
                <View>
                    <BackBtn onPress={() => navigation.goBack()} />
                    <Image
                        source={require('../assets/images/bk.png')}
                        style={styles.cover}
                    />
                    <Text style={styles.title}>Temukan Furnitur Kamu!</Text>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => console.log(values)}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            touched,
                            handleSubmit,
                            values,
                            errors,
                            isValid,
                            setFieldTouched,
                        }) => (
                            <View>
                                <View style={styles.wrapper}>
                                    <Text style={styles.label}>Email</Text>
                                    <View
                                        style={styles.inputWrapper(
                                            touched.email
                                                ? COLORS.primary
                                                : COLORS.offwhite
                                        )}
                                    >
                                        <MaterialCommunityIcons
                                            name='email-outline'
                                            size={20}
                                            color={COLORS.gray3}
                                            style={styles.iconStyle}
                                        />
                                        <TextInput
                                            placeholder='Email'
                                            onFocus={() => {
                                                setFieldTouched('email');
                                            }}
                                            onBlur={() => {
                                                setFieldTouched('email', '');
                                            }}
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={{ flex: 1 }}
                                        />
                                    </View>
                                    {touched.email && errors.email && (
                                        <Text style={styles.errorMessage}>
                                            {errors.email}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.wrapper}>
                                    <Text style={styles.label}>Password</Text>
                                    <View
                                        style={styles.inputWrapper(
                                            touched.password
                                                ? COLORS.primary
                                                : COLORS.offwhite
                                        )}
                                    >
                                        <MaterialCommunityIcons
                                            name='lock-outline'
                                            size={20}
                                            color={COLORS.gray3}
                                            style={styles.iconStyle}
                                        />
                                        <TextInput
                                            secureTextEntry={obsecureText}
                                            placeholder='Password'
                                            onFocus={() => {
                                                setFieldTouched('password');
                                            }}
                                            onBlur={() => {
                                                setFieldTouched('password', '');
                                            }}
                                            value={values.password}
                                            onChangeText={handleChange(
                                                'password'
                                            )}
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={{ flex: 1 }}
                                        />
                                        <TouchableOpacity
                                            onPress={() =>
                                                setObsecureText(!obsecureText)
                                            }
                                        >
                                            <MaterialCommunityIcons
                                                name={
                                                    obsecureText
                                                        ? 'eye-outline'
                                                        : 'eye-off-outline'
                                                }
                                                size={20}
                                                color={COLORS.gray3}
                                                style={styles.iconStyle}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {touched.password && errors.password && (
                                        <Text style={styles.errorMessage}>
                                            {errors.password}
                                        </Text>
                                    )}
                                </View>
                                <Button
                                    title={'L O G I N'}
                                    onPress={isValid ? handleSubmit : () => {}}
                                    isValid={isValid}
                                />
                                <Text
                                    style={styles.registration}
                                    onPress={() =>
                                        navigation.navigate('Register')
                                    }
                                >
                                    Belum punya akun? Daftar
                                </Text>
                            </View>
                        )}
                    </Formik>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}
