import { useState } from 'react';
import { ScrollView, View, Alert, Image, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackBtn, Button } from '../components';
import styles from './styles/login.style';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email tidak valid')
        .required('Email tidak boleh kosong')
        .matches(/\S+@\S+\.\S+/, 'Email tidak valid'),
});

export default function ForgotPasswordScreen({ navigation }) {
    const [loader, setLoader] = useState(false);
    const [response, setResponse] = useState(null);

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
                            email: '',
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
