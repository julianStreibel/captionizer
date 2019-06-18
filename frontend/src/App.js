import React, { Component } from 'react';
import { Button } from 'reactstrap';
import styled from 'styled-components';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      captions: []
    }
  }

  componentDidMount() {
    fetch("http://0.0.0.0:8080/api/v1/picture")
      .then(res => res.json())
      .then((res) => this.setState({ init: true, captions: res.captions, hashtags: res.hashtags }))
  }

  render() {
    const { init, captions, hashtags } = this.state;
    return (
      <React.Fragment>
        <h1>Captions</h1>
        {init && captions.map(caption => <p>{caption}</p>)}
        <br />
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <h3>Bild url muss noch in api/routes/picture gesetzt werden bis upload fertig</h3>
        {init && hashtags.map(h => h.replace(" ", "") + " ")}
        <br />
        <RedButton>Hi</RedButton>
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
