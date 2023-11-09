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

const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
        .min(8, 'Password terlalu pendek')
        .required('Password tidak boleh kosong')
        .matches(
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
            'Password harus memiliki setidaknya satu simbol unik'
        ),

    confirmNewPassword: Yup.string()
        .min(8, 'Password terlalu pendek')
        .required('Password tidak boleh kosong')
        .matches(
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
            'Password harus memiliki setidaknya satu simbol unik'
        )
        .oneOf([Yup.ref('password'), null], 'Password tidak cocok'),
});

export default function ResetPasswordScreen({ navigation }) {
    const [loader, setLoader] = useState(false);
    const [response, setResponse] = useState(null);
    const [obsecureText, setObsecureText] = useState(false);

    const inValidForm = () => {
        Alert.alert(
            'Formulir Tidak Valid',
            'Tolong lengkapi formulir dengan benar',
            [
                {
                    text: 'Lanjutkan',
                    onPress: () => console.log('Lanjutkan Ditekan'),
                },
            ]
        );
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
                            newPassword: '',
                            confirmNewPassword: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => console.log(values)}
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
                                            touched.newPassword
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
                                            placeholder='New Password'
                                            onFocus={() => {
                                                setFieldTouched('newPassword');
                                            }}
                                            onBlur={() => {
                                                setFieldTouched(
                                                    'newPassword',
                                                    ''
                                                );
                                            }}
                                            value={values.newPassword}
                                            onChangeText={handleChange(
                                                'newPassword'
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
                                    {touched.newPassword &&
                                        errors.newPassword && (
                                            <Text style={styles.errorMessage}>
                                                {errors.newPassword}
                                            </Text>
                                        )}
                                </View>
                                <View style={styles.wrapper}>
                                    <View
                                        style={styles.inputWrapper(
                                            touched.confirmNewPassword
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
                                            placeholder='Konfirmasi Password Baru'
                                            onFocus={() => {
                                                setFieldTouched(
                                                    'confirmNewPassword'
                                                );
                                            }}
                                            onBlur={() => {
                                                setFieldTouched(
                                                    'confirmNewPassword',
                                                    ''
                                                );
                                            }}
                                            value={values.confirmNewPassword}
                                            onChangeText={handleChange(
                                                'confirmNewPassword'
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
                                    {touched.confirmNewPassword &&
                                        errors.confirmNewPassword && (
                                            <Text style={styles.errorMessage}>
                                                {errors.confirmNewPassword}
                                            </Text>
                                        )}
                                </View>
                                <View style={{ marginTop: -15 }}>
                                    <Button
                                        title={'R E S E T'}
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
