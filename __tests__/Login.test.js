/**
 * Created by root on 6/28/17.
 */
import {shallow} from 'enzyme'
import React, {Component} from 'react';
import {Text} from 'react-native';
import configureMockStore from 'redux-mock-store'
import Keyboard from '../src/components/Login/Keyboard'
import PasswordConnected, {Password} from '../src/components/Login/Password'
import TelInputConnected, {TelInput} from '../src/components/Login/TelInput'
import Confirm from '../src/components/Shared/Buttons/Confirm'
import Tutorial from '../src/components/Shared/Components/Tutorial'
import store from '../src/utils/store'
const mockStore = configureMockStore()

/***
 * Testing Login Components
 ***/

describe('<Login />', () => {

    /***
     * Testing Keyboard component
     ***/

    // it('should render Keyboard correctly', () => {
    //     const wrapper = shallow(<Keyboard/>)
    //     expect(wrapper).toMatchSnapshot()
    //     expect(wrapper.length).toBe(1)
    // })
    //
    // it('should render parent View correctly', () => {
    //     const wrapper = shallow(<Keyboard/>)
    //     expect(wrapper.find('View').at(0).length).toBe(1)
    // })
    //
    // it('should render all children correctly', () => {
    //     const wrapper = shallow(<Keyboard/>)
    //     expect(wrapper.find('View').at(0).children().length).toBe(4)
    // })
    //
    // it('should call renderRow() function and return cells', () => {
    //     const wrapper = shallow(<Keyboard/>)
    //     expect(wrapper.instance().renderRow([1, 2, 3]).props.children[0].key).toEqual("1")
    //     expect(wrapper.instance().renderRow([1, 2, 3]).props.children[1].key).toEqual("2")
    //     expect(wrapper.instance().renderRow([1, 2, 3]).props.children[2].key).toEqual("3")
    // })
    //
    // it('should call renderCell() function and render text', () => {
    //     const number = 2
    //     const wrapper = shallow(<Keyboard/>)
    //     expect(wrapper.instance().renderCell(number).props.children.props.children).toBe(number)
    // })
    //
    // it('renderCell() should return TouchableOpacity', () => {
    //     const number = 2
    //     const wrapper = shallow(<Keyboard/>)
    //     expect(wrapper.instance().renderCell(number).type.displayName).toEqual('TouchableOpacity')
    // })
    //
    // it('should call onNumberPress() function via props', () => {
    //     const number = 1
    //     const onClick = jest.fn()
    //     const wrapper = shallow(<Keyboard onNumberPress={onClick}/>)
    //     wrapper.instance().renderCell(number).props.onPress() // simulate click
    //     expect(onClick).toBeCalled()
    // })
    //
    // it('should call onBackspacePress() function via props', () => {
    //     const onClick = jest.fn()
    //     const wrapper = shallow(<Keyboard onBackspacePress={onClick}/>)
    //     wrapper.instance().renderBackspace().props.onPress() // simulate click
    //     expect(onClick).toBeCalled()
    // })
    //
    // it('renderBackspace should return Back text', () => {
    //     const expectedText = "back"
    //     const wrapper = shallow(<Keyboard />)
    //     expect(wrapper.instance().renderBackspace().props.children.props.children).toEqual(expectedText)
    // })
    //
    // it('should call renderHelp() and return Image component', () => {
    //     const wrapper = shallow(<Keyboard/>)
    //     expect(wrapper.instance().renderHelp().props.children.props.source).toBeDefined()
    // })
    //
    // it('should call onHelpPress() function via props', () => {
    //     const onClick = jest.fn()
    //     const wrapper = shallow(<Keyboard onHelpPress={onClick}/>)
    //     wrapper.instance().renderHelp().props.onPress() // simulate click
    //     expect(onClick).toBeCalled()
    // })

    /***
     * Testing Password component
     ***/

    let user = {
        registered: true,
        id: 1,
        password: 'password',
        imei: 'imei',
        phone: '+123456789',
        token: 'token',
        avatar: {
            b64: 'path',
            localPath: 'localPath'
        }
    }

    let navigation = {
        dispatch: jest.fn(), // spy function
        state: {
            params: jest.fn() // spy function
        }
    }

    it('should render Password component correctly', () => {
        const wrapper = shallow(<Password store={store} user={user} navigation={navigation}/>)
        expect(wrapper).toMatchSnapshot()
        expect(wrapper.length).toBe(1)
    })

    it('Password component should handle states', () => {
        initialState = {
            maxPasswordLength: 4,
            password: '',
            imei: "some imei",
            match: null,
        }
        expectedState = {
            maxPasswordLength: 0,
            password: 'djamik123',
            imei: 'new imei',
            match: true,
        }
        const wrapper = shallow(<Password store={store} user={user} navigation={navigation}/>)
        expect(wrapper.state().password).toEqual('')
        expect(wrapper.state().match).toEqual(null)
        // will change state of the app
        wrapper.setState({
            maxPasswordLength: 0,
            password: 'djamik123',
            imei: 'new imei',
            match: true,
        })
        expect(wrapper.state()).toEqual(expectedState)
    })

    it('Password component children count should be equal to 3', () => {
        const wrapper = shallow(<Password store={store} user={user} navigation={navigation}/>)
        expect(wrapper.find('View').at(0).children().length).toEqual(3)
    })

    it('should render correctly Keyboard', () => {
        const wrapper = shallow(<Password store={store} user={user} navigation={navigation}/>)
        expect(wrapper.find('View').at(0).children().at(2).length).toBe(1)
    })

    // it('handleNumberPress() should be called', () => {
    //     const mockClick = jest.fn()
    //     const passwordComponent = shallow(<Password store={mockStore} user={user} navigation={navigation}/>)
    //     const keyboardComponent = shallow(<Keyboard onNumberPress={mockClick}/>)
    //     keyboardComponent.instance().props.onNumberPress()
    //     expect(mockClick).toBeCalled()
    // })
    //
    // it('handleBackspacePress() should be called', () => {
    //     const mockClick = jest.fn()
    //     const passwordComponent = shallow(<Password store={mockStore} user={user} navigation={navigation}/>)
    //     const keyboardComponent = shallow(<Keyboard onBackspacePress={mockClick}/>)
    //     keyboardComponent.instance().props.onBackspacePress()
    //     expect(mockClick).toBeCalled()
    // })
    //
    // it('handleHelpPress() should be called', () => {
    //     const mockClick = jest.fn()
    //     const passwordComponent = shallow(<Password store={mockStore} user={user} navigation={navigation}/>)
    //     const keyboardComponent = shallow(<Keyboard onHelpPress={mockClick}/>)
    //     keyboardComponent.instance().props.onHelpPress()
    //     expect(mockClick).toBeCalled()
    // })

    it('passwordConfirmAvailability() should be called and return false value', () => {
        expectedValue = false
        const wrapper = shallow(<Password store={mockStore} user={user} navigation={navigation}/>)
        expect(
            wrapper.instance().passwordConfirmAvailability()
        ).toEqual(expectedValue)
    })

    it('renderPassMask() should be called and return digits', () => {
        const wrapper = shallow(<Password store={mockStore} user={user} navigation={navigation}/>)
        expect(
            typeof wrapper.instance().renderPassMask()
        ).toEqual('object')
        expect(
            wrapper.instance().renderPassMask()
        ).toBeDefined()
    })

    it('renderInputStep() should return value 1/2', () => {
        expectedValue = "1 / 2"
        user.registered = false

        let navigation = {
            dispatch: jest.fn(), // spy function
            state: {
                params: {
                    password: ''
                } // spy function
            }
        }
        const wrapper = shallow(<Password store={mockStore} user={user} navigation={navigation}/>)
        expect(wrapper.instance().renderInputStep().props.children).toEqual(expectedValue)
    })

    it('renderInputStep() should return null', () => {
        expectedValue = null
        user.registered = true
        const wrapper = shallow(<Password store={mockStore} user={user} navigation={navigation}/>)
        expect(wrapper.instance().renderInputStep()).toEqual(expectedValue)
    })

    /***
     * Testing TelInput component
     ***/

    it('should render TelInput component correctly', () => {
        const wrapper = shallow(<TelInput store={store} user={user} navigation={navigation}/>)
        expect(wrapper).toMatchSnapshot()
        expect(wrapper.length).toBe(1)
    })

    it('should render child components', () => {
        const wrapper = shallow(<TelInput store={store} user={user} navigation={navigation}/>)
        expect(wrapper.find('View').first().children().length).toBe(3)
    })

    it('TelInput component should handle states', () => {
        initialState = {
            maxPhoneLength: 19,
            phone: '',
        }
        expectedState = {
            maxPhoneLength: 40,
            phone: '+998901443407',
        }
        const wrapper = shallow(<TelInput store={store} user={user} navigation={navigation}/>)
        expect(wrapper.state()).toEqual(initialState)
        // will change state of the app
        wrapper.setState({
            maxPhoneLength: 40,
            phone: '+998901443407',
        })
        expect(wrapper.state()).toEqual(expectedState)
    })

    it('renderInput() should be called and return some view with phoneNumber', () => {
        const expectedPhoneNumber = '+998901443407'
        const onClick = jest.fn()
        const wrapper = shallow(<TelInput store={mockStore} user={user} navigation={navigation}/>)
        wrapper.setState({
            phone: expectedPhoneNumber
        })
        expect(wrapper.instance().renderInput().props.children.props.children).toEqual(expectedPhoneNumber)
    })

    /***
     * Testing Confirm component
     ***/

    it('should render Confirm component correctly', () => {
        const onClick = jest.fn()
        const active = false
        const wrapper = shallow(<Confirm active={active} onPress={onClick}/>)
        expect(wrapper).toMatchSnapshot()
        expect(wrapper.length).toBe(1)
    })

    it('should render TouchableHighlight', () => {
        const onClick = jest.fn()
        const active = false
        const wrapper = shallow(<Confirm active={active} onPress={onClick}/>)
        expect(wrapper.find('TouchableHighlight').first().length).toBe(1)
    })

    it('if not Active should not be clickable', () => {
        const onClick = jest.fn()
        const active = false
        const wrapper = shallow(<Confirm active={active} onPress={onClick}/>)
        expect(wrapper.find('TouchableHighlight').first().props().onPress).toEqual(null)
    })

    it('if Active should be clickable', () => {
        const onClick = jest.fn()
        const active = true
        const wrapper = shallow(<Confirm active={active} onPress={onClick}/>)
        expect(wrapper.find('TouchableHighlight').first().props().onPress).toEqual(onClick)
    })

    it('should call onPress function onClick', () => {
        const onClicked = jest.fn()
        const active = true
        const wrapper = shallow(<Confirm active={active} onPress={onClicked}/>)
        wrapper.find('TouchableHighlight').first().simulate('press') // simulate click
        expect(onClicked).toBeCalled()
    })

    /***
     * Testing Tutorial component
     ***/


    it('should render Tutorial component correctly', () => {
        let navigation = {
            dispatch: jest.fn(), // spy function
            state: {
                params: {
                    nextScene: jest.fn()
                } // spy function
            }
        }

        const wrapper = shallow(<Tutorial navigation={navigation}/>)
        expect(wrapper).toMatchSnapshot()
        expect(wrapper.length).toBe(1)
    })

    it('Tutorial should render child components', () => {
        let navigation = {
            dispatch: jest.fn(), // spy function
            state: {
                params: {
                    nextScene: jest.fn()
                } // spy function
            }
        }

        const wrapper = shallow(<Tutorial navigation={navigation}/>)
        expect(
            wrapper.find('View').first().children().length
        ).toBe(3)
    })

    it('Tutorial should call method handleTutorialPlay() and change State', () => {
        let navigation = {
            dispatch: jest.fn(), // spy function
            state: {
                params: {
                    nextScene: jest.fn()
                } // spy function
            }
        }

        const wrapper = shallow(<Tutorial navigation={navigation}/>)
        expect(
            wrapper.state().watched
        ).toBe(false)

        wrapper.find('TouchableOpacity').first().simulate('press')

        expect(
            wrapper.state().watched
        ).toBe(true)
    })

    it('Tutorial should handle state', () => {
        const initialState = {
            watched: false,
            nextScene: 'Camera',
        }
        const expectedState = {
            watched: true,
            nextScene: 'Not Camera',
        }

        let navigation = {
            dispatch: jest.fn(), // spy function
            state: {
                params: {
                    nextScene: 'Camera'
                } // spy function
            }
        }

        const wrapper = shallow(<Tutorial navigation={navigation}/>)
        // Test initial state
        expect(
            wrapper.state().watched
        ).toBe(false)

        expect(
            wrapper.state().nextScene
        ).toBe('Camera')

        // changing state
        wrapper.setState({
            watched: true,
            nextScene: 'Not Camera',
        })

        // Test expected state
        expect(wrapper.state()).toEqual(expectedState)
    })

    it('should render tutorial text', () => {
        const expectedText = 'tutorial for Camera'
        let navigation = {
            dispatch: jest.fn(), // spy function
            state: {
                params: {
                    nextScene: 'Camera'
                } // spy function
            }
        }
        const wrapper = shallow(<Tutorial navigation={navigation}/>)
        expect(wrapper.find('Text').first().props().children).toEqual(expectedText)

    })

})