/**
 * Created by Lanny on 2017/11/4.
 */
import React, {Component, PropTypes} from 'react';
// import PropTypes from 'prop-types';
import {
    View,
    PanResponder,
    Animated,
    Easing,
    Text,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
}from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const scale = (SCREEN_WIDTH / 375);

const direction = {
    left: 'left',
    right: 'right',
    both: 'both'
};
export default class PanResponderDrawer extends Component {

    static propTypes = {
        overlayVisible: PropTypes.bool,
        direction: PropTypes.string,

        drawerWidth: PropTypes.number,
        leftDrawerOpen: PropTypes.func,
        leftDrawerClose: PropTypes.func,
        overlayOpacity: PropTypes.number,
        animatedDuration: PropTypes.number,
        movePanResponderCapture: PropTypes.bool,
    };

    static defaultProps = {
        overlayVisible: false,
        direction: direction.both,
        movePanResponderCapture: true,
        drawerWidth: scale * 300,
        leftDrawerOpen: () => {
        },
        leftDrawerClose: () => {
        },
        overlayOpacity: 0.8,
        animatedDuration: 800,
    };

    constructor(props) {
        super(props);
        const {drawerWidth} = this.props;
        this.state = {
            pan: new Animated.Value(0),
            _visible: false,
        };
        this.listener = this.state.pan.addListener((obj) => {
            let isVisible = (Math.abs(obj.value) / this.props.drawerWidth) > 0;
            if (this.state._visible !== isVisible) {
                this.setState({_visible: isVisible})
            }

        });
        this.leftOpened = false;
        this.rightOpened = false;
        this.leftDrawerActive = false;
        this.rightDrawerActive = false;
        this.leftCanOpen = this.props.direction === 'both' || this.props.direction === 'left';
        this.rightCanOpen = this.props.direction === 'both' || this.props.direction === 'right';
        this.MAX_DX = drawerWidth > SCREEN_WIDTH ? SCREEN_WIDTH : drawerWidth;
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => {
                return false;
            },
            onStartShouldSetPanResponderCapture: (evt, gestureState) => {
                return false
            },
            onMoveShouldSetPanResponder: (evt, {dx, dy}) => {
                if (Math.abs(dy) > Math.abs(dx)) {
                    return false;
                }
                if (this.leftCanOpen && !this.leftOpened && !this.rightDrawerActive && (dx > 0)) {
                    this.leftDrawerActive = true;
                    return true;
                }
                if ((this.leftOpened && this.leftCanOpen && (dx < 0)) || (this.rightCanOpen && this.rightOpened && (dx > 0))) {
                    return true
                }
                if (this.rightCanOpen && !this.rightOpened && !this.leftDrawerActive && (dx < 0)) {
                    this.rightDrawerActive = true;
                    return true;
                }
                return false;
            },
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                return false;
            },
            onPanResponderGrant: (e, gestureState) => {
                this.state.pan.setOffset(this.state.pan._value);
                this.state.pan.setValue(0);
            },
            onPanResponderMove: (e, gestureState) => {

                let dx = gestureState.dx;
                if (this.rightDrawerActive) {
                    dx *= -1;
                }
                let x = Math.min(dx, this.props.drawerWidth - this.state.pan._offset);
                this.state.pan.setValue(x);
            },
            onPanResponderRelease: (e, gestureState) => {
                this.state.pan.flattenOffset();
                let dx = gestureState.dx;
                if (this.leftDrawerActive) {
                    if (dx > 0) {
                        if (dx < this.MAX_DX / 2) {
                            this._animateDrawerClose();
                        } else if (dx > this.MAX_DX / 2) {
                            this._animateDrawerOpen();
                        }
                    } else if (dx < 0) {
                        if (-dx < this.MAX_DX / 2) {
                            this._animateDrawerOpen();
                        } else if (-dx > this.MAX_DX / 2) {
                            this._animateDrawerClose();
                        }
                    }
                } else {
                    if (dx < 0) {
                        if (-dx < this.MAX_DX / 2) {
                            this._animateDrawerClose();
                        } else if (-dx > this.MAX_DX / 2) {
                            this._animateDrawerOpen();
                        }
                    } else if (dx > 0) {
                        if (dx > this.MAX_DX / 2) {
                            this._animateDrawerClose();
                        } else if (dx < this.MAX_DX / 2) {
                            this._animateDrawerOpen();
                        }
                    }
                }

            },
        })
    }

    componentWillUnmount() {
        this.state.pan.removeListener(this.listener);
    }

    _animateDrawerOpen() {
        Animated.timing(this.state.pan, {
            toValue: this.props.drawerWidth,
            easing: Easing.linear,
        }).start(() => {
            if (this.leftDrawerActive) {
                this.leftOpened = true;
            } else if (this.rightDrawerActive) {
                this.rightOpened = true;
            }

        })

    }

    _animateDrawerClose() {
        Animated.timing(this.state.pan, {
            toValue: 0,
            easing: Easing.linear
        }).start(() => {
            this.leftDrawerActive = false;
            this.rightDrawerActive = false;
            this.leftOpened = false;
            this.rightOpened = false;
        });

    }

    componentDidMount() {
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState._visible !== this.state._visible) {

        }
    }

    render() {
        return (
            <View style={styles.container} {...this._panResponder.panHandlers}>
                {this.props.children}
                {this.state._visible && (
                    <TouchableWithoutFeedback onPress={() => this._animateDrawerClose()}>
                        <Animated.View style={[styles.overlayContainer, {
                            opacity: this.state.pan.interpolate({
                                inputRange: [0, 100, 300],
                                outputRange: [0, 0.5, 0.8]
                            })
                        }]}/>
                    </TouchableWithoutFeedback>
                )}
                {this.leftDrawerActive &&
                <Animated.View style={[styles.leftDrawerContainer, {width: this.state.pan}]}>
                    {this.props.leftDrawerContent}
                </Animated.View>}
                {this.rightDrawerActive &&
                <Animated.View style={[styles.rightDrawerContainer, {width: this.state.pan}]}>
                    {this.props.rightDrawerContent}
                </Animated.View>
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
    },
    leftDrawerContainer: {
        backgroundColor: '#f2d3f3',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        height: SCREEN_HEIGHT

    },
    rightDrawerContainer: {
        backgroundColor: '#fed188',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        height: SCREEN_HEIGHT
    },
    overlayContainer: {
        backgroundColor: 'black',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    text: {
        color: 'red',
        textAlign: 'center',
    },
    overlayTouch: {
        flex: 1,
    }
});