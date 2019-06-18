import React, { Component } from 'react';
import { Button } from 'reactstrap';
import styled from 'styled-components';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      list: []
    }
  }

  componentDidMount() {
    fetch("http://0.0.0.0:8080/api/v1/test")
      .then(res => res.json())
      .then((res) => this.setState({ init: true, list: res }))
  }

  render() {
    const { init, list } = this.state;
    return (
      <React.Fragment>
        {init && list}
        <br />
        <RedButton>Hi</RedButton>
        <br />
        <br />
        <DivButton
          color={"orange"}
        >Hii</DivButton>
      </React.Fragment>
    );
  }
}

const RedButton = styled(Button)`
  background-color: red !important;
`;

const DivButton = styled.div`
  height: 20px;
  width: 50px;
  ${props => props.color && `background-color: ${props.color};`}
`;

export default App;
