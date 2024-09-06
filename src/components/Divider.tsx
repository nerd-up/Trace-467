import { Text, View } from 'react-native';

import styles from '../styles/Styles';
import { Fonts } from '../theme/Fonts';

type DividerProps = {
    text?: string
}

export default function Divider(props: DividerProps) {

    if (!props.text) {
        return (
            <View style={styles.dividerContainer}>
                <View style={styles.underLine}></View>
            </View>
        );
    }
    else {
        return (
            <View style={styles.dividerContainer}>
                <View style={styles.underLine}></View>
                <Text style={{ height: '100%', marginLeft: 10, marginRight: 10, fontFamily: Fonts.bold }}>{props.text}</Text>
                <View style={styles.underLine}></View>
            </View>
        );
    }
}