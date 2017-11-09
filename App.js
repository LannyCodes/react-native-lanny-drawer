/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';

import PanResponderDrawer from './src/PanResponderDrawer'

export default class App extends Component<{}> {


    render() {
        let leftDrawerContent = (<View>
            <Text style={styles.text}>我是左菜单的内容，哈哈哈哈哈哈!</Text>
            <Text style={styles.text}>我是左菜单的内容，哈哈哈哈哈哈!</Text>
            <Text style={styles.text}>我是左菜单的内容，哈哈哈哈哈哈!</Text>
            <Text style={styles.text}>我是左菜单的内容，哈哈哈哈哈哈!</Text>
            <Text style={styles.text}>我是左菜单的内容，哈哈哈哈哈哈!</Text>
        </View>);

        let rightDrawerContent = (
            <View>
                <Text style={styles.text}>我是右菜单的内容，哈哈哈哈哈哈!</Text>
                <Text style={styles.text}>我是右菜单的内容，哈哈哈哈哈哈!</Text>
                <Text style={styles.text}>我是右菜单的内容，哈哈哈哈哈哈!</Text>
                <Text style={styles.text}>我是右菜单的内容，哈哈哈哈哈哈!</Text>
                <Text style={styles.text}>我是右菜单的内容，哈哈哈哈哈哈!</Text>
            </View>
        )

        return (
            <PanResponderDrawer
                ref={(drawer) => {
                    this._drawer = drawer
                }}
                drawerWidth={300}
                leftDisabled={true}
                leftDrawerContent={leftDrawerContent}
                rightDrawerContent={rightDrawerContent}
                leftDrawerOpen={(finished) => {
                    console.log(finished)
                }}
            >
                <View style={styles.container}>
                    <Text style={styles.welcome}>I am the main content!</Text>
                </View>
            </PanResponderDrawer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
