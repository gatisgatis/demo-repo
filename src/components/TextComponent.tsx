import React, {FC} from 'react';
import {makeStyles} from '@material-ui/core/styles';

interface Props {
    text: string;
    isRed: boolean;
}

const useStyles = makeStyles({
    textStyle: {
        textAlign: 'center',
        color: isRed => (isRed? 'red' : 'blue'),
    },
    otherClass: isRed => {
        if(isRed) {
            return {
                backgroundColor: 'grey',
            }
        } else {
            return {
                backgroundColor: 'yellow',
            }
        }
    }
})

const TextComponent: FC<Props> = ({text, isRed}) => {
    const classes = useStyles(isRed);
    return <h1 className={`${classes.textStyle} ${classes.otherClass}`}>
        {text}
    </h1>
}

export default TextComponent;
