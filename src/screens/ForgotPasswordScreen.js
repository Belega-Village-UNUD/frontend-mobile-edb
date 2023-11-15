import { useState } from 'react';
import { ScrollView, View, Alert, Image, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackBtn, Button } from '../components';
import styles from './styles/login.style';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email tidak valid')
        .required('Email tidak boleh kosong')
        .matches(/\S+@\S+\.\S+/, 'Email tidak valid'),
});

export default function ForgotPasswordScreen({ navigation }) {
    const [loader, setLoader] = useState(false);

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

    const handleForgotPassword = async (values) => {
        setLoader(true);
        try {
            const endpoint =
                'https://belega-commerce-api-staging-tku2lejm6q-et.a.run.app/api/auth/password/forgot';
            const data = values;
            const response = await axios.post(endpoint, data);
            if (response.data.status === 200) {
                setLoader(false);
                await AsyncStorage.setItem(
                    'tokenForgot',
                    response.data.data.token
                );
                Alert.alert(
                    'OTP Terkirim',
                    'OTP telah dikirim ulang ke email anda',
                    [
                        {
                            text: 'Lanjutkan',
                            onPress: () =>
                                navigation.navigate('Auth', { screen: 'Otp' }),
                        },
                    ]
                );
            }
        } catch (error) {
            setLoader(false);
            Alert.alert('OTP Gagal Terkirim', 'Akun Tidak Ditemukan', [
                {
                    text: 'Ok',
                    onPress: () => {},
                },
            ]);
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
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => handleForgotPassword(values)}
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
                                <View style={{ marginTop: -15 }}>
                                    <Button
                                        loader={loader}
                                        title={'C O N F I R M'}
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
