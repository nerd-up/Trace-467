import React from 'react';
import { Text, View } from 'react-native';

import styles from '../styles/Styles';

type MissionLineProps = {
    text: string
}

const MissionLine = (props: MissionLineProps) => {
    return (
        <View style={{ margin: 2, alignItems: 'center' }}>
            <Text style={[styles.iconHeaderText, { fontSize: 28 }]}>{props.text}</Text>
        </View>
    )
}

export default MissionLine