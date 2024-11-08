import { BASE_URI } from '@env';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Formik } from 'formik';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import { BackBtn, Button } from '../components';
import { COLORS } from '../constants/theme';
import styles from './styles/login.style';

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, 'Password terlalu pendek')
        .required('Password tidak boleh kosong')
        .matches(
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
            'Password harus memiliki setidaknya satu simbol unik'
        ),
    confirmPassword: Yup.string()
        .min(8, 'Password terlalu pendek')
        .required('Password tidak boleh kosong')
        .matches(
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
            'Password harus memiliki setidaknya satu simbol unik'
        )
        .oneOf([Yup.ref('password'), null], 'Password tidak cocok'),
    email: Yup.string()
        .email('Email tidak valid')
        .required('Email tidak boleh kosong')
        .matches(/\S+@\S+\.\S+/, 'Email tidak valid'),
});

const REGISTER_URI = BASE_URI + '/api/auth/register';

export default function SignupScreen({ navigation }) {
    const [loader, setLoader] = useState(false);
    const [password, setPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);

    const inValidForm = () => {
        Alert.alert(
            'Formulir Tidak Valid',
            'Tolong lengkapi formulir dengan benar',
            [
                {
                    text: 'Lanjutkan',
                    onPress: () => {},
                },
            ]
        );
    };

    const handleSignup = async (values) => {
        setLoader(true);
        try {
            const data = values;
            const response = await axios.post(REGISTER_URI, data);
            if (response.data.status === 201) {
                setLoader(false);
                await AsyncStorage.setItem('token', response.data.data.token);
                Alert.alert('Berhasil', response.data.message, [
                    {
                        text: 'lanjutkan',
                        onPress: () =>
                            navigation.navigate('Auth', { screen: 'Otp' }),
                    },
                ]);
            } else {
                Alert.alert('Error', response.data.message, [
                    {
                        text: 'Ok',
                        onPress: () => {},
                    },
                ]);
            }
        } catch (e) {
            setLoader(false);
            if (e.response && e.response.status === 400) {
                Alert.alert('Error', e.response.data.message, [
                    {
                        text: 'Ok',
                        onPress: () => {},
                    },
                ]);
            } else {
                console.log(e);
            }
        } finally {
            setLoader(false);
        }
    };

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
                        initialValues={{
                            email: '',
                            password: '',
                            confirmPassword: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => handleSignup(values)}
                        validateOnMount
                        validateOnChange
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
                            <View style={{ marginTop: -15 }}>
                                <View style={styles.wrapper}>
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
                                            secureTextEntry={password}
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
                                                setPassword(!password)
                                            }
                                        >
                                            <MaterialCommunityIcons
                                                name={
                                                    password
                                                        ? 'eye-off-outline'
                                                        : 'eye-outline'
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
                                <View style={styles.wrapper}>
                                    <View
                                        style={styles.inputWrapper(
                                            touched.confirmPassword
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
                                            secureTextEntry={confirmPassword}
                                            placeholder='Konfirmasi Password'
                                            onFocus={() => {
                                                setFieldTouched(
                                                    'confirmPassword'
                                                );
                                            }}
                                            onBlur={() => {
                                                setFieldTouched(
                                                    'confirmPassword',
                                                    ''
                                                );
                                            }}
                                            value={values.confirmPassword}
                                            onChangeText={handleChange(
                                                'confirmPassword'
                                            )}
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={{ flex: 1 }}
                                        />
                                        <TouchableOpacity
                                            onPress={() =>
                                                setConfirmPassword(
                                                    !confirmPassword
                                                )
                                            }
                                        >
                                            <MaterialCommunityIcons
                                                name={
                                                    confirmPassword
                                                        ? 'eye-off-outline'
                                                        : 'eye-outline'
                                                }
                                                size={20}
                                                color={COLORS.gray3}
                                                style={styles.iconStyle}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {touched.confirmPassword &&
                                        errors.confirmPassword && (
                                            <Text style={styles.errorMessage}>
                                                {errors.confirmPassword}
                                            </Text>
                                        )}
                                </View>
                                <View style={{ marginTop: -15 }}>
                                    <Button
                                        loader={loader}
                                        title={'D A F T A R'}
                                        onPress={
                                            isValid ? handleSubmit : inValidForm
                                        }
                                        isValid={isValid}
                                    />
                                </View>
                            </View>
                        )}
                    </Formik>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}
