import React, { Component } from "react"
import styled, { keyframes } from 'styled-components';


class Input extends Component {
    constructor(props) {
        super(props)
        this.state = {
            clicked: false,
            placeholder: this.props.placeholder
        }

        this.onFocus = this.onFocus.bind(this)
        this.onBlur = this.onBlur.bind(this)
    }


    onFocus() {
        this.setState({ placeholder: "", clicked: true })
    }

    onBlur() {
        this.setState({ placeholder: this.props.placeholder, clicked: false })
    }


    render() {
        const { clicked } = this.state
        return (
            <Wrapper>
                {clicked ?
                    <Superscript>{this.props.placeholder}</Superscript>
                    :
                    <Placeholder></Placeholder>
                }
                <CostumInput placeholder={this.state.placeholder} onFocus={this.onFocus} onBlur={this.onBlur}></CostumInput>
                <Underscore />
            </Wrapper>
        )
    }
}

const CostumInput = styled.input`
    width: 100%
    background-color: transparent;
    heigh: 1em; 
    border-radius: 0;
    border: none;
    outline: none
  
    -webkit-appearance: none;
    -moz-appearance: none;
  
    font-family: inherit;
    font-size: 1em;
`
const Placeholder = styled.div`
    height: 1.5em; 
`


const Underscore = styled.div`
    height: 0.1rem
    background-color: rgb(201, 214, 255)
`

const keyFrame1 = keyframes`
  0% {
        opacity:1
        transform: translateY(1.5em)
  }
  25%{
      opacity: 1
  }
  100% {
    opacity. 1
  }
`
const Superscript = styled.div`
    height: 1.5em 
    animation: ${keyFrame1} 0.5s 
`

const Wrapper = styled.div`
    height: 3.5em 
`

export default Input