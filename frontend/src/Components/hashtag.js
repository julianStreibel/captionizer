import React, { Component } from 'react';
import styled from "styled-components"

class Hashtag extends Component {
    constructor(props) {
        super(props)
        this.state = {
            over: false
        }
        this.onClick = this.onClick.bind(this)
        this.handleMouseOver = this.handleMouseOver.bind(this)
    }

    onClick() {
        this.props.deleteHashtag(this.props.index)
    }

    handleMouseOver() {
        let over = !this.state.over
        this.setState({ over: over })
    }

    render() {
        // const { over } = this.state
        return (
            <Frame /*onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOver}*/ onClick={this.onClick}>

                <Text >{this.props.hashtag.replace(" ", "")}</Text>
                {/* {over && <DeleteButton src="./delete.png" onClick={this.onClick}></DeleteButton>} */}

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
display: -webkit-inline-box;
display: -webkit-inline-flex;
display: -ms-inline-flexbox;
display: inline-flex;
height: 2em;
color: white;
border-radius: 0.1rem;
margin: 0 0 0.5rem 0.5em;
background-color: rgb(201, 214, 255);
`

const Text = styled.div`
    line-height: 1.5em
    margin: 0 0.3em 
    padding: 0.3em
`

// const DeleteButton = styled.img`
//     max-height: 50% 
//     margin: auto 0.2em auto 1em 
//     display: block
//     cursor: pointer
// ` 