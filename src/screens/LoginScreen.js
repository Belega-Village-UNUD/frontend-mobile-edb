import { useState } from 'react';
import {
    ScrollView,
    View,
    Alert,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackBtn, Button } from '../components';
import styles from './styles/login.style';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, 'Password terlalu pendek')
        .required('Password tidak boleh kosong')
        .matches(
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
            'Password harus memiliki setidaknya satu simbol unik'
        ),

    email: Yup.string()
        .email('Email tidak valid')
        .required('Email tidak boleh kosong')
        .matches(/\S+@\S+\.\S+/, 'Email tidak valid'),
});

export default function LoginScreen({ navigation }) {
    const [loader, setLoader] = useState(false);
    const [obsecureText, setObsecureText] = useState(false);

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

    const handleSetUserLogin = async (values) => {
        setLoader(true);
        try {
            const endpoint =
                'https://belega-commerce-api-staging-tku2lejm6q-et.a.run.app/api/auth/login';
            const data = values;
            const response = await axios.post(endpoint, data);
            if (response.data.status == 200) {
                setLoader(false);
                // const { email, is_verified } = response.data.data.payload;
                await AsyncStorage.setItem('token', response.data.data.token);
                // await AsyncStorage.setItem(
                //     'userLogin',
                //     JSON.stringify({ email, token, is_verified })
                // );
                navigation.navigate('Bottom Navigation', { screen: 'Home' });
            } else {
                setLoader(false);
                Alert.alert('Error', response.data.message, [
                    {
                        text: 'Ok',
                        onPress: () => {},
                    },
                ]);
            }
        } catch (error) {
            {
                Alert.alert('Error Login', 'Masukkan Kredensial yang Benar', [
                    {
                        text: 'Ok',
                        onPress: () => {},
                    },
                ]);
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
                        initialValues={{ email: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => handleSetUserLogin(values)}
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
                            <View>
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
                                <View style={{ marginTop: -15 }}>
                                    <Button
                                        loader={loader}
                                        title={'M A S U K'}
                                        onPress={
                                            isValid ? handleSubmit : inValidForm
                                        }
                                        isValid={isValid}
                                    />
                                    <View
                                        style={{
                                            marginTop: -25,
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Text
                                            style={styles.registration}
                                            onPress={() =>
                                                navigation.navigate('Signup')
                                            }
                                        >
                                            Belum punya akun? Daftar
                                            {'                  '}
                                        </Text>
                                        <Text
                                            style={styles.forgotPassword}
                                            onPress={() =>
                                                navigation.navigate('Auth', {
                                                    screen: 'Forgot Password',
                                                })
                                            }
                                        >
                                            Lupa Password?
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </Formik>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}
