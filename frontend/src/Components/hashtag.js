import React, { Component } from 'react';
import styled from "styled-components"

class Hashtag extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.onClick = this.onClick.bind(this)
        console.log(this.props)
    }

    onClick() {
        this.props.deleteHashtag(this.props.index)
    }

    render() {
        return (
            <Frame>
                <Text>{this.props.hashtag.replace(" ", "")}</Text>
                <DeleteButton src="./delete.png" onClick={this.onClick}></DeleteButton>
            </Frame >
        )
    }

}

export default Hashtag


// const Span = styled.span`
//     display: inline-block
//     height: 100%
//     vertical-align: middle 
// `

const Frame = styled.div`
    display: inline-flex 
    height: 2em
    border: 1px solid black 
    border-radius: 0.5rem
    margin: 0 0 0.5rem 0.5em 
    background-color: white 
    border-color: #A9A9A9
    line-height: 2em
    box-shadow: 0 10px 20px 0 rgba(0,0,0,0.11),
        0 2px 10px 0 rgba(0,0,0,0.08);
    
`

const Text = styled.div`
    line-height: 1.7em
    margin-left: 0.2em 
`

const DeleteButton = styled.img`
    max-height: 50% 
    margin: auto 0.2em auto 1em 
    display: block
    cursor: pointer
` 