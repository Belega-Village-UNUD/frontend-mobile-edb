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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

Yup.addMethod(Yup.string, 'uniqueEmail', function (errorMessage) {
    return this.test('uniqueEmail', errorMessage, async function (value) {
        const { path, createError } = this;
        // const isUnique = await checkEmailUnique(value); // replace this with your API call
        // return isUnique || createError({ path, message: errorMessage });
    });
});

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
    // username: Yup.string()
    //     .required('Username tidak boleh kosong')
    //     .matches(
    //         /^[A-Za-z0-9_.]+$/,
    //         'Username hanya boleh berisi huruf, angka, titik, dan underscore, spasi tidak diperbolehkan'
    //     ),
    // fullname: Yup.string()
    //     .required('Nama tidak boleh kosong')
    //     .matches(/^[A-Za-z ]*$/, 'Nama hanya boleh berisi huruf dan spasi'),
    email: Yup.string()
        .email('Email tidak valid')
        .required('Email tidak boleh kosong')
        .matches(/\S+@\S+\.\S+/, 'Email tidak valid'),
    // .uniqueEmail('Email sudah terdaftar'),
});

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
            const endpoint =
                'https://belega-commerce-api-staging-tku2lejm6q-et.a.run.app/api/auth/register';
            const data = values;
            const response = await axios.post(endpoint, data);
            if (response.data.status === 201) {
                setLoader(false);
                // const { email, token } = response.data.data;
                // await AsyncStorage.setItem(
                //     'userRegister',
                //     JSON.stringify({ email, token })
                // );
                await AsyncStorage.setItem('token', response.data.data.token);
                Alert.alert('Berhasil', response.data.message, [
                    {
                        text: 'lanjutkan',
                        onPress: () =>
                            navigation.navigate('Auth', { screen: 'Otp' }),
                    },
                ]);
            } else {
                setLoader(false);
                Alert.alert('Error', response.data.message, [
                    {
                        text: 'Ok',
                        onPress: () => {},
                    },
                ]);
            }
        } catch (e) {
            setLoader(false);
            console.log(e);
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
                            // username: '',
                            // fullname: '',
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
                                {/* <View style={styles.wrapper}>
                                    <View
                                        style={styles.inputWrapper(
                                            touched.username
                                                ? COLORS.primary
                                                : COLORS.offwhite
                                        )}
                                    >
                                        <MaterialCommunityIcons
                                            name='account-box-outline'
                                            size={20}
                                            color={COLORS.gray3}
                                            style={styles.iconStyle}
                                        />
                                        <TextInput
                                            placeholder='Nama Pengguna'
                                            onFocus={() => {
                                                setFieldTouched('username');
                                            }}
                                            onBlur={() => {
                                                setFieldTouched('username', '');
                                            }}
                                            value={values.username}
                                            onChangeText={handleChange(
                                                'username'
                                            )}
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={{ flex: 1 }}
                                        />
                                    </View>
                                    {touched.username && errors.username && (
                                        <Text style={styles.errorMessage}>
                                            {errors.username}
                                        </Text>
                                    )}
                                </View> */}
                                {/* <View style={styles.wrapper}>
                                    <View
                                        style={styles.inputWrapper(
                                            touched.fullname
                                                ? COLORS.primary
                                                : COLORS.offwhite
                                        )}
                                    >
                                        <MaterialCommunityIcons
                                            name='account-outline'
                                            size={20}
                                            color={COLORS.gray3}
                                            style={styles.iconStyle}
                                        />
                                        <TextInput
                                            placeholder='Nama Lengkap'
                                            onFocus={() => {
                                                setFieldTouched('fullname');
                                            }}
                                            onBlur={() => {
                                                setFieldTouched('fullname', '');
                                            }}
                                            value={values.fullname}
                                            onChangeText={handleChange(
                                                'fullname'
                                            )}
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={{ flex: 1 }}
                                        />
                                    </View>
                                    {touched.fullname && errors.fullname && (
                                        <Text style={styles.errorMessage}>
                                            {errors.fullname}
                                        </Text>
                                    )}
                                </View> */}
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
