import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, FormText } from 'reactstrap';
import styled from 'styled-components';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      captions: [],
      file: null
    }
    this.handleFileChange = this.handleFileChange.bind(this);
    this.upload = this.upload.bind(this);
  }

  render() {
    const { init, captions, hashtags, file } = this.state;
    return (
      <React.Fragment>
        <FormGroup>
          <Label for="exampleFile">File</Label>
          <Input type="file" name="file" onChange={(e) => this.handleFileChange(e.target.files[0])} />
          <FormText color="muted">
            This is some placeholder block-level help text for the above input.
            It's a bit lighter and easily wraps to a new line.
          </FormText>
        </FormGroup>
        <Button disabled={!file} onClick={this.upload}>Upload</Button>
        {init && <React.Fragment>
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
        </React.Fragment>}
      </React.Fragment>
    );
  }

  handleFileChange(file) {
    this.setState({ file })
  }

  upload() {
    const { file } = this.state;
    alert(file)
    let formData = new FormData();
    formData.append("image", file)
    fetch("http://0.0.0.0:8080/api/v1/picture", { method: "post", body: formData })
      .then(res => res.json())
      .then((res) => this.setState({ init: true, captions: res.captions, hashtags: res.hashtags }))
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
