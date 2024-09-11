import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type CheckBoxProps = {
    isChecked: boolean,
    onPress: () => void,
    label: string,
}

export default function CheckBox({ isChecked, onPress, label }: CheckBoxProps) {
    return (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
                height: 20,
                width: 20,
                borderRadius: 3,
                borderWidth: 1,
                borderColor: '#000',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
            }}>
                {isChecked && (
                    <View style={{
                        height: 12,
                        width: 12,
                        backgroundColor: '#000',
                    }} />
                )}
            </View>
            <Text>{label}</Text>
        </TouchableOpacity>
    );
}