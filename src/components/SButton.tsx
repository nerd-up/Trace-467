import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import formStyles from '../styles/FormStyles';
import Colors from '../theme/ScholarColors';

type SButtonProps = {
    styleType?: string,
    text?: string,
    action?: () => void,
}

const SButton = (props: SButtonProps) => {

    if (props.styleType === "Sentence") {
        return (
            <TouchableOpacity onPress={props.action}>
                <Text style={formStyles.btnText}>{props.text}</Text>
            </TouchableOpacity>
        )
    }
    else if (props.styleType === "BorderButton") {
        return (
            <TouchableOpacity style={[formStyles.submitBtn, { backgroundColor: Colors.background, borderColor: "black", borderRadius: 10, borderWidth: 5 }]} onPress={props.action}>
                <Text style={[formStyles.btnText, { color: "black" }]}>{props.text}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity style={formStyles.submitBtn} onPress={props.action}>
            <Text style={[formStyles.btnText, { color: "white" }]}>{props.text}</Text>
        </TouchableOpacity>
    )
}

export default SButton
