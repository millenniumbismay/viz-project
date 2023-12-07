import React, { useEffect, useState } from 'react';
import { Slider } from '@material-ui/core';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    container: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 'fit-content',
    },
    thumb: {
        position: 'inherit',
    },
    label: {
        marginLeft: 12,
        top: 20,
        position: 'inherit',
    },
});

const PlayPauseThumbComponent = ({ isPlaying, currValue, ...props }) => {
    const classes = useStyles();

    return (
        <div className={classes.container} style={{ left: props.style.left }}>
            <span {...props}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </span>
            <Typography variant="caption" className={classes.label}>
                {currValue}
            </Typography>
        </div>
    );
};

const CustomSlider = ({ min, max, sliderValue, setSliderValue }) => {
    const [isPlaying, setIsPlaying] = useState(false);


    useEffect(() => {
        const interval = setInterval(() => {
            if (isPlaying) {
                setSliderValue((prevValue) => {
                    if (prevValue === max) {
                        setIsPlaying(false);
                        return min;
                    }
                    return prevValue < max ? prevValue + 1 : prevValue;

                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isPlaying, setIsPlaying, setSliderValue]);

    return (
        <div className="slider">
            <Slider
                value={sliderValue}
                step={1}
                onClick={() => setIsPlaying(!isPlaying)}
                min={min}
                max={max}
                ThumbComponent={(props) => <PlayPauseThumbComponent isPlaying={isPlaying} currValue={sliderValue} {...props} />}
            />
        </div>
    )
}

export default CustomSlider;